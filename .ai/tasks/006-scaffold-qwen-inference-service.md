# Task: Scaffold the local Qwen inference service

## Status

- [ ] planned
- [ ] in progress
- [ ] implemented
- [ ] reviewed
- [ ] done

## Goal

Create an isolated Python service project for `Qwen/Qwen-Image-Edit-2511` without loading the model yet.

## Context

The Next.js app already owns the browser-facing contract. Qwen should run in a separate Python/PyTorch process so the web app and ML runtime can be developed and deployed independently.

## Proposed structure

```text
services/qwen-inference/
  pyproject.toml
  README.md
  .env.example
  src/offroadify_inference/
    __init__.py
    app.py
    config.py
  tests/test_health.py
```

## Tooling

Prefer:

- Python 3.11
- `uv`
- FastAPI
- Uvicorn
- Pydantic settings or a small explicit environment loader
- Pytest

Do not install PyTorch, Diffusers, Transformers, or model weights yet.

## Endpoint

```text
GET /health
```

Response:

```json
{"status":"ok","model_loaded":false}
```

## Configuration placeholders

```text
QWEN_MODEL_ID=Qwen/Qwen-Image-Edit-2511
QWEN_DEVICE_PROFILE=cuda
QWEN_INFERENCE_TOKEN=
```

## Requirements

- Bind to `127.0.0.1` in local commands.
- No model load and no edit endpoint yet.
- No model files in Git.
- Add setup instructions and a health test.
- Do not modify Next.js.
- Do not commit or push automatically.

## Acceptance criteria

- [ ] Service installs and starts.
- [ ] `GET /health` returns 200.
- [ ] Health reports `model_loaded: false`.
- [ ] Tests pass.
- [ ] No model weights are downloaded.

## Checks

```bash
cd services/qwen-inference
uv sync
uv run pytest
uv run uvicorn offroadify_inference.app:app --host 127.0.0.1 --port 8000
```
