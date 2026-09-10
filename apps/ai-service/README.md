# SAQR AI service

Independent Python boundary. Only `GET /health` is implemented.

From the repository root:

```sh
python -m venv apps/ai-service/.venv
# Activate this virtual environment using your shell, then:
python -m pip install -e "./apps/ai-service[test]"
python -m uvicorn app.main:app --app-dir apps/ai-service --reload --port 8000
python -m pytest apps/ai-service/tests
```

Future protected requests must come through NestJS permission and enrollment checks. No browser-to-AI access or LLM credentials are configured. Directory boundaries reserve ingestion, RAG, embeddings and provider adapters without implementing them.
