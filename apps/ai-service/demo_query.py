#!/usr/bin/env python3
"""
SAQR Task 2 Demo Verification Script.
Demonstrates end-to-end:
manual -> ingestion -> chunks -> embeddings -> index -> query -> retrieved results -> source citation
"""

import sys
from pathlib import Path

# Add apps/ai-service to Python module search path
current_dir = Path(__file__).resolve().parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from app.rag.engine import (
    DEFAULT_DOC_ID,
    DEFAULT_DOC_TITLE,
    DEFAULT_MANUAL_PATH,
    RAGEngine,
)


def run_demo() -> None:
    print("=" * 70)
    print("      SAQR RAG DEMO - AGRICULTURAL DRONE OPERATIONS MANUAL")
    print("=" * 70)

    # 1. Initialize RAG Engine
    engine = RAGEngine()
    print(f"\n[1] Source Manual Path: {DEFAULT_MANUAL_PATH}")
    assert DEFAULT_MANUAL_PATH.is_file(), "Manual file not found"

    # 2. Ingest and Index
    print(f"[2] Ingesting and chunking '{DEFAULT_DOC_TITLE}'...")
    chunk_count = engine.index_document(DEFAULT_MANUAL_PATH, DEFAULT_DOC_ID, DEFAULT_DOC_TITLE)
    print(f"    ✔ Successfully chunked, embedded, and indexed: {chunk_count} chunks")
    print(f"    ✔ Vector Store Type: In-memory Cosine Vector Index (384-dimensional)")

    # 3. Demo Questions
    demo_questions = [
        "What should a pilot check before starting an agricultural spraying mission?",
        "How can a pilot reduce spray drift?",
        "What weather factors should be considered before spraying?",
        "Why is flight altitude important during spraying?",
        "What should the pilot do if conditions become unsafe?",
    ]

    print("\n" + "=" * 70)
    print("                  EXECUTING DEMO QUERIES")
    print("=" * 70)

    for i, question in enumerate(demo_questions, 1):
        print(f"\n--- [DEMO QUESTION {i}] ---")
        print(f"Query: \"{question}\"")
        
        response = engine.query(question, top_k=3)
        
        print("\n[Retrieved Source Citations]:")
        for rank, src in enumerate(response.sources, 1):
            print(f"  {rank}. [{src.section}] (Relevance Score: {src.relevance_score:.4f})")
            print(f"     Source: {src.source_ref}")
            print(f"     Excerpt: {src.snippet}")

        print("\n[Grounded AI Response]:")
        print(response.answer)
        print("-" * 70)

    print("\n✔ End-to-end RAG demonstration completed successfully!")


if __name__ == "__main__":
    run_demo()
