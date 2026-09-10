from fastapi import FastAPI

app = FastAPI(title="SAQR AI Service", version="0.1.0")


@app.get("/health", tags=["Health"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "saqr-ai-service"}
