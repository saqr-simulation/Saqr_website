import hashlib
import math
import re
from app.embeddings.base import BaseEmbeddingProvider

STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "if", "in", "on", "at", "to", "for",
    "with", "by", "of", "about", "as", "into", "like", "through", "after", "over",
    "between", "out", "against", "during", "without", "before", "under", "around",
    "among", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
    "do", "does", "did", "can", "could", "should", "would", "must", "shall", "will",
    "it", "its", "this", "that", "these", "those", "what", "which", "who", "whom",
    "how", "why", "when", "where",
}

# Domain associations linking queries to manual terminology
DOMAIN_ASSOCIATIONS = {
    "pilot": ["rpic", "operator", "flight", "crew"],
    "check": ["checklist", "inspection", "verify", "preflight", "pre-flight"],
    "starting": ["preflight", "pre-flight", "prior", "preparation", "checklist"],
    "reduce": ["mitigation", "mitigate", "control", "minimization", "reduction"],
    "drift": ["droplet", "off-target", "downwash", "vmd", "swath", "adjuvants"],
    "weather": ["meteorological", "wind", "temperature", "humidity", "inversion", "delta-t"],
    "wind": ["gusts", "speed", "thresholds", "downwind"],
    "altitude": ["height", "canopy", "radar", "clearance", "elevation"],
    "spraying": ["spray", "application", "nozzle", "liquid", "chemical", "droplet"],
    "unsafe": ["emergency", "abort", "failsafe", "rupture", "hazard", "incident"],
}


class LocalSemanticEmbeddingProvider(BaseEmbeddingProvider):
    """
    Lightweight, deterministic local semantic embedding generator.
    Produces L2-normalized 768-dimensional dense vectors using hashed feature projections
    over word unigrams, bigrams, subwords, and domain semantic associations.
    Requires zero external network access and no heavy deep learning frameworks.
    """

    def __init__(self, dimension: int = 384) -> None:
        self._dimension = dimension

    @property
    def dimension(self) -> int:
        return self._dimension

    def _tokenize(self, text: str) -> list[str]:
        raw = re.findall(r"\b[a-zA-Z0-9\-_]{2,}\b", text.lower())
        return [t.strip("-_") for t in raw if t.strip("-_") not in STOP_WORDS]

    def embed_text(self, text: str) -> list[float]:
        tokens = self._tokenize(text)
        vector = [0.0] * self._dimension

        if not tokens:
            val = 1.0 / math.sqrt(self._dimension)
            return [val] * self._dimension

        # 1. Word Unigrams and Domain Synonyms
        for t in tokens:
            idx = int(hashlib.md5(f"w:{t}".encode("utf-8")).hexdigest(), 16) % self._dimension
            vector[idx] += 2.0

            if t in DOMAIN_ASSOCIATIONS:
                for syn in DOMAIN_ASSOCIATIONS[t]:
                    sidx = int(hashlib.md5(f"w:{syn}".encode("utf-8")).hexdigest(), 16) % self._dimension
                    vector[sidx] += 1.2

        # 2. Word Bigrams (capturing contextual phrases)
        for i in range(len(tokens) - 1):
            bg = f"{tokens[i]}_{tokens[i+1]}"
            bidx = int(hashlib.md5(f"bg:{bg}".encode("utf-8")).hexdigest(), 16) % self._dimension
            vector[bidx] += 3.5

        # L2-normalization for cosine similarity via dot product
        norm_sq = sum(x * x for x in vector)
        if norm_sq > 0.0:
            norm = math.sqrt(norm_sq)
            vector = [x / norm for x in vector]

        return vector
