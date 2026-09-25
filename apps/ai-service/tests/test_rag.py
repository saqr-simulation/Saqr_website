from fastapi.testclient import TestClient
from app.embeddings import get_embedding_provider
from app.ingestion import chunk_markdown, read_document
from app.main import app
from app.rag import LocalVectorStore, RAGEngine
from app.rag.engine import DEFAULT_DOC_ID, DEFAULT_DOC_TITLE, DEFAULT_MANUAL_PATH

DEMO_QUESTIONS = [
    {
        "question": "What should a pilot check before starting an agricultural spraying mission?",
        "expected_section_substring": "Pre-Flight",
    },
    {
        "question": "How can a pilot reduce spray drift?",
        "expected_section_substring": "Drift",
    },
    {
        "question": "What weather factors should be considered before spraying?",
        "expected_section_substring": "Weather",
    },
    {
        "question": "Why is flight altitude important during spraying?",
        "expected_section_substring": "Altitude",
    },
    {
        "question": "What should the pilot do if conditions become unsafe?",
        "expected_section_substring": "Emergency",
    },
]


def test_document_ingestion_and_chunking() -> None:
    """Verify document reading, cleaning, section-based chunking, and metadata preservation."""
    assert DEFAULT_MANUAL_PATH.is_file(), f"Manual file missing at {DEFAULT_MANUAL_PATH}"
    
    text = read_document(DEFAULT_MANUAL_PATH)
    assert len(text) > 1000, "Manual content should be non-trivial"

    chunks = chunk_markdown(text, DEFAULT_DOC_ID, DEFAULT_DOC_TITLE)
    assert len(chunks) >= 20, f"Expected at least 20 chunks, got {len(chunks)}"

    for chunk in chunks:
        assert chunk.chunk_id.startswith(DEFAULT_DOC_ID), "Chunk ID must include document ID"
        assert chunk.document_id == DEFAULT_DOC_ID
        assert chunk.document_title == DEFAULT_DOC_TITLE
        assert len(chunk.section.strip()) > 0, "Chunk must preserve section name"
        assert chunk.chunk_index > 0
        assert len(chunk.content.strip()) > 20, "Chunk content must not be empty"
        assert chunk.source_ref.startswith(DEFAULT_DOC_TITLE), "Source reference must cite document title"


def test_embedding_provider_properties() -> None:
    """Verify embedding provider dimensions, unit normalization, and semantic discrimination."""
    provider = get_embedding_provider()
    assert provider.dimension == 384

    text_a = "Agricultural drone spraying droplet size and drift reduction techniques."
    text_b = "Spray drift mitigation using coarse droplet nozzles and downwash."
    text_unrelated = "Baking artisan sourdough bread with whole wheat flour."

    vec_a = provider.embed_text(text_a)
    vec_b = provider.embed_text(text_b)
    vec_unrelated = provider.embed_text(text_unrelated)

    assert len(vec_a) == 384
    # L2-normalization check (sum of squares ~= 1.0)
    norm_a = sum(x * x for x in vec_a)
    assert abs(norm_a - 1.0) < 1e-4

    # Cosine similarities
    sim_related = sum(a * b for a, b in zip(vec_a, vec_b))
    sim_unrelated = sum(a * b for a, b in zip(vec_a, vec_unrelated))

    assert sim_related > sim_unrelated, f"Related text ({sim_related:.3f}) must score higher than unrelated ({sim_unrelated:.3f})"
    assert sim_related > 0.2


def test_vector_store_indexing_and_search() -> None:
    """Verify in-memory vector store indexing and cosine similarity retrieval ranking."""
    store = LocalVectorStore()
    assert store.count() == 0

    provider = get_embedding_provider()
    text = read_document(DEFAULT_MANUAL_PATH)
    chunks = chunk_markdown(text, DEFAULT_DOC_ID, DEFAULT_DOC_TITLE)
    vectors = provider.embed_batch([c.content for c in chunks])

    store.add_chunks(chunks, vectors)
    assert store.count() == len(chunks)

    # Search for drift query
    query = "How can a pilot reduce spray drift?"
    q_vec = provider.embed_text(query)
    results = store.search(q_vec, top_k=3)

    assert len(results) == 3
    # Top result should be scored descending
    assert results[0].score >= results[1].score >= results[2].score
    assert any("Drift" in r.section or "Droplet" in r.section for r in results)


def test_rag_engine_5_demo_questions() -> None:
    """Verify end-to-end RAG retrieval, citations, and grounded answering on all 5 demo questions."""
    engine = RAGEngine()
    count = engine.index_document(DEFAULT_MANUAL_PATH, DEFAULT_DOC_ID, DEFAULT_DOC_TITLE)
    assert count >= 20

    for item in DEMO_QUESTIONS:
        q = item["question"]
        expected_sec = item["expected_section_substring"]

        response = engine.query(q, top_k=3)

        assert response.question == q
        assert response.chunks_retrieved == 3
        assert len(response.sources) == 3
        assert len(response.answer) > 50

        # Check that sources contain the manual title and proper references
        for src in response.sources:
            assert src.document_id == DEFAULT_DOC_ID
            assert src.document_title == DEFAULT_DOC_TITLE
            assert src.relevance_score > 0.0
            assert len(src.snippet) > 10

        # Check that the expected section appears in the retrieved sources
        found_expected_section = any(
            expected_sec.lower() in src.section.lower() for src in response.sources
        )
        assert found_expected_section, f"Question '{q}' should retrieve section matching '{expected_sec}'"


def test_fastapi_rag_endpoints() -> None:
    """Verify FastAPI /rag/index and /rag/query HTTP endpoints with TestClient."""
    with TestClient(app) as client:
        # 1. Test POST /rag/index
        index_res = client.post("/rag/index")
        assert index_res.status_code == 200
        data = index_res.json()
        assert data["document_id"] == DEFAULT_DOC_ID
        assert data["chunks_indexed"] >= 20
        assert data["status"] == "successfully_indexed"

        # 2. Test POST /rag/query for weather question
        query_payload = {
            "question": "What weather factors should be considered before spraying?",
            "top_k": 3,
        }
        query_res = client.post("/rag/query", json=query_payload)
        assert query_res.status_code == 200
        qdata = query_res.json()
        assert qdata["question"] == query_payload["question"]
        assert len(qdata["sources"]) == 3
        assert any("Weather" in s["section"] or "Wind" in s["section"] for s in qdata["sources"])
        assert "Agricultural Drone Spraying" in qdata["answer"]
