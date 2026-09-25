from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, HTTPException
from app.rag import (
    RAGIndexRequest,
    RAGIndexResponse,
    RAGQueryRequest,
    RAGQueryResponse,
    rag_engine,
)
from app.rag.engine import DEFAULT_DOC_ID, DEFAULT_DOC_TITLE, DEFAULT_MANUAL_PATH


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event to auto-index default demo manual on service startup."""
    if DEFAULT_MANUAL_PATH.is_file():
        try:
            count = rag_engine.index_document(DEFAULT_MANUAL_PATH, DEFAULT_DOC_ID, DEFAULT_DOC_TITLE)
            print(f"[RAG] Auto-indexed {count} chunks from {DEFAULT_MANUAL_PATH.name}")
        except Exception as e:
            print(f"[RAG] Startup indexing warning: {e}")
    yield


app = FastAPI(
    title="SAQR AI Service",
    description="Independent AI and RAG boundary for SAQR Drone Academy",
    version="0.1.0",
    lifespan=lifespan,
)


@app.get("/health", tags=["Health"])
def health() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok", "service": "saqr-ai-service"}


@app.post("/rag/index", response_model=RAGIndexResponse, tags=["RAG"])
def index_document(payload: RAGIndexRequest | None = None) -> RAGIndexResponse:
    """
    Ingest and index a training document into the vector store.
    Defaults to the Agricultural Drone Spraying & Drift Mitigation Manual.
    """
    target_path = Path(payload.file_path) if (payload and payload.file_path) else DEFAULT_MANUAL_PATH

    if not target_path.is_file():
        raise HTTPException(status_code=404, detail=f"Manual file not found at: {target_path}")

    try:
        count = rag_engine.index_document(
            target_path,
            document_id=DEFAULT_DOC_ID,
            document_title=DEFAULT_DOC_TITLE,
        )
        return RAGIndexResponse(
            document_id=DEFAULT_DOC_ID,
            document_title=DEFAULT_DOC_TITLE,
            chunks_indexed=count,
            status="successfully_indexed",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Indexing failed: {str(e)}")


@app.post("/rag/query", response_model=RAGQueryResponse, tags=["RAG"])
def query_rag(payload: RAGQueryRequest) -> RAGQueryResponse:
    """
    Query the indexed agricultural drone training material.
    Returns grounded answers and attributed source citations with relevance scores.
    """
    try:
        response = rag_engine.query(question=payload.question, top_k=payload.top_k)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
