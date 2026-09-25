import os
from app.embeddings.base import BaseEmbeddingProvider
from app.embeddings.local import LocalSemanticEmbeddingProvider


def get_embedding_provider() -> BaseEmbeddingProvider:
    """
    Factory function returning the configured embedding provider.
    Defaults to LocalSemanticEmbeddingProvider (deterministic, zero external API requirement).
    """
    # In future production phases with external credentials, external providers can be selected here.
    return LocalSemanticEmbeddingProvider(dimension=384)
