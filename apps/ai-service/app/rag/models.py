from pydantic import BaseModel, Field


class SearchResult(BaseModel):
    """A search result retrieved from the vector index."""

    chunk_id: str
    document_id: str
    document_title: str
    section: str
    chunk_index: int
    content: str
    source_ref: str
    score: float = Field(description="Cosine similarity relevance score (0.0 to 1.0)")


class SourceCitation(BaseModel):
    """Attributed source citation returned in RAG query response."""

    document_id: str
    document_title: str
    section: str
    source_ref: str
    relevance_score: float
    snippet: str


class RAGQueryRequest(BaseModel):
    """Request payload for querying indexed training material."""

    question: str = Field(min_length=3, description="User question about agricultural drone operations")
    top_k: int = Field(default=3, ge=1, le=10, description="Number of relevant chunks to retrieve")


class RAGQueryResponse(BaseModel):
    """Response payload containing grounded answer and citations."""

    question: str
    answer: str
    sources: list[SourceCitation]
    chunks_retrieved: int


class RAGIndexRequest(BaseModel):
    """Request payload to trigger document indexing."""

    file_path: str | None = Field(default=None, description="Optional path to custom markdown manual")


class RAGIndexResponse(BaseModel):
    """Response payload after indexing documents."""

    document_id: str
    document_title: str
    chunks_indexed: int
    status: str
