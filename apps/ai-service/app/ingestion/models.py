from pydantic import BaseModel, Field


class DocumentChunk(BaseModel):
    """Represents a coherent text chunk extracted from a source training document."""

    chunk_id: str = Field(description="Unique identifier for this chunk")
    document_id: str = Field(description="ID of the parent document")
    document_title: str = Field(description="Title of the parent document")
    section: str = Field(description="Heading or section name containing this chunk")
    chunk_index: int = Field(description="Sequential position of chunk within the document")
    content: str = Field(description="Cleaned text content of the chunk")
    source_ref: str = Field(description="Human-readable citation and reference path")
