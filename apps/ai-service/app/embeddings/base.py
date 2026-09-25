from abc import ABC, abstractmethod


class BaseEmbeddingProvider(ABC):
    """Abstract base class for embedding providers."""

    @abstractmethod
    def embed_text(self, text: str) -> list[float]:
        """Generate a normalized embedding vector for a single text."""
        pass

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Generate normalized embedding vectors for a batch of texts."""
        return [self.embed_text(t) for t in texts]

    @property
    @abstractmethod
    def dimension(self) -> int:
        """Vector dimensionality."""
        pass
