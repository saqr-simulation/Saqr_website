from pathlib import Path
from app.embeddings.base import BaseEmbeddingProvider
from app.embeddings.factory import get_embedding_provider
from app.ingestion.parser import chunk_markdown, read_document
from app.rag.models import RAGQueryResponse, SearchResult, SourceCitation
from app.rag.vector_store import LocalVectorStore

DEFAULT_MANUAL_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "data"
    / "manuals"
    / "agricultural-drone-spraying-and-drift-mitigation-manual.md"
)
DEFAULT_DOC_ID = "doc-spraying-manual"
DEFAULT_DOC_TITLE = "Agricultural Drone Spraying & Drift Mitigation Manual"


class RAGEngine:
    """
    Core RAG Engine coordinating ingestion, embedding generation, vector indexing,
    and grounded retrieval answering.
    """

    def __init__(
        self,
        vector_store: LocalVectorStore | None = None,
        embedding_provider: BaseEmbeddingProvider | None = None,
    ) -> None:
        self.vector_store = vector_store or LocalVectorStore()
        self.embedding_provider = embedding_provider or get_embedding_provider()

    def index_document(
        self,
        file_path: Path | str,
        document_id: str = DEFAULT_DOC_ID,
        document_title: str = DEFAULT_DOC_TITLE,
    ) -> int:
        """Ingest, chunk, embed, and index a document."""
        text = read_document(file_path)
        chunks = chunk_markdown(text, document_id, document_title)
        
        contents = [c.content for c in chunks]
        vectors = self.embedding_provider.embed_batch(contents)
        
        self.vector_store.add_chunks(chunks, vectors)
        return len(chunks)

    def query(self, question: str, top_k: int = 3) -> RAGQueryResponse:
        """
        Embed question, retrieve top_k most relevant chunks, and formulate a grounded answer.
        """
        if self.vector_store.count() == 0:
            # Auto-index default manual if store is currently empty
            if DEFAULT_MANUAL_PATH.is_file():
                self.index_document(DEFAULT_MANUAL_PATH, DEFAULT_DOC_ID, DEFAULT_DOC_TITLE)

        query_vector = self.embedding_provider.embed_text(question)
        search_results = self.vector_store.search(query_vector, top_k=top_k)

        if not search_results:
            return RAGQueryResponse(
                question=question,
                answer="No relevant training material found in the indexed manuals for this inquiry.",
                sources=[],
                chunks_retrieved=0,
            )

        citations: list[SourceCitation] = []
        for r in search_results:
            # Extract a concise snippet (first 250 characters of body after header)
            lines = [line for line in r.content.split("\n") if not line.startswith("[")]
            clean_snippet = " ".join(" ".join(lines).split())[:250] + "..."
            citations.append(
                SourceCitation(
                    document_id=r.document_id,
                    document_title=r.document_title,
                    section=r.section,
                    source_ref=r.source_ref,
                    relevance_score=r.score,
                    snippet=clean_snippet,
                )
            )

        # Synthesize grounded answer from top-ranked chunks
        grounded_answer = self._synthesize_grounded_answer(question, search_results)

        return RAGQueryResponse(
            question=question,
            answer=grounded_answer,
            sources=citations,
            chunks_retrieved=len(search_results),
        )

    def _synthesize_grounded_answer(self, question: str, results: list[SearchResult]) -> str:
        """
        Construct a concise, strictly grounded response using facts from the top retrieved chunks.
        """
        top_match = results[0]
        secondary_sections = [r.section for r in results[1:] if r.section != top_match.section]
        
        # Clean lines from the primary matching chunk
        primary_lines = [
            line.strip("- *0123456789. ")
            for line in top_match.content.split("\n")
            if line.strip() and not line.startswith("[") and not line.startswith("#")
        ]
        key_facts = primary_lines[:5]
        summary_points = "\n".join(f"• {point}" for point in key_facts)

        answer_text = (
            f"Based on the **{top_match.document_title}** (Section: *{top_match.section}*):\n\n"
            f"{summary_points}"
        )

        if secondary_sections:
            sec_list = ", ".join(f"*{s}*" for s in secondary_sections[:2])
            answer_text += f"\n\nAdditional relevant guidelines are detailed in {sec_list}."

        return answer_text


# Global default RAG engine instance
rag_engine = RAGEngine()
