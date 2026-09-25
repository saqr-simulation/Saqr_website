from app.ingestion.models import DocumentChunk
from app.rag.models import SearchResult


class LocalVectorStore:
    """
    Lightweight, in-memory vector index for storing and retrieving document chunks.
    Designed with a clean interface that can later be swapped for PostgreSQL + pgvector.
    """

    def __init__(self) -> None:
        self._chunks: dict[str, DocumentChunk] = {}
        self._vectors: dict[str, list[float]] = {}

    def add_chunk(self, chunk: DocumentChunk, vector: list[float]) -> None:
        """Index a single document chunk with its embedding vector."""
        self._chunks[chunk.chunk_id] = chunk
        self._vectors[chunk.chunk_id] = vector

    def add_chunks(self, chunks: list[DocumentChunk], vectors: list[list[float]]) -> None:
        """Batch index document chunks with their embedding vectors."""
        for chunk, vector in zip(chunks, vectors):
            self.add_chunk(chunk, vector)

    def search(self, query_vector: list[float], top_k: int = 3, min_score: float = 0.0) -> list[SearchResult]:
        """
        Perform cosine similarity search between query_vector and all stored vectors.
        Assumes vectors are L2-normalized, so cosine similarity = dot product.
        """
        results: list[SearchResult] = []

        for chunk_id, doc_vector in self._vectors.items():
            chunk = self._chunks[chunk_id]
            # Dot product of normalized vectors = cosine similarity
            score = sum(q * d for q, d in zip(query_vector, doc_vector))
            if score >= min_score:
                results.append(
                    SearchResult(
                        chunk_id=chunk.chunk_id,
                        document_id=chunk.document_id,
                        document_title=chunk.document_title,
                        section=chunk.section,
                        chunk_index=chunk.chunk_index,
                        content=chunk.content,
                        source_ref=chunk.source_ref,
                        score=round(score, 4),
                    )
                )

        # Sort descending by similarity score
        results.sort(key=lambda r: r.score, reverse=True)
        return results[:top_k]

    def clear(self) -> None:
        """Clear all indexed data."""
        self._chunks.clear()
        self._vectors.clear()

    def count(self) -> int:
        """Return total number of indexed chunks."""
        return len(self._chunks)

    def get_chunk(self, chunk_id: str) -> DocumentChunk | None:
        """Retrieve a specific chunk by ID."""
        return self._chunks.get(chunk_id)
