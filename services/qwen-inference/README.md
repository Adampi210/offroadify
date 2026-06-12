# Offroadify Qwen inference service

Isolated Python service that will run `Qwen/Qwen-Image-Edit-2511` locally. This
skeleton exposes only a health endpoint; no model weights are installed,
downloaded, or loaded yet, and there is no image-edit endpoint yet.

## Requirements

- [uv](https://docs.astral.sh/uv/) (manages Python and dependencies)
- Python 3.11 (uv installs it automatically via `.python-version` if missing)

## Setup

```bash
cd services/qwen-inference
uv sync
```

This creates `.venv/` and installs FastAPI, Uvicorn, and the dev test tools.
PyTorch, Diffusers, and Transformers are intentionally not installed yet.

## Configuration

Configuration is read from environment variables (see `.env.example`):

| Variable | Default | Purpose |
| --- | --- | --- |
| `QWEN_MODEL_ID` | `Qwen/Qwen-Image-Edit-2511` | Model to load in a later task |
| `QWEN_DEVICE_PROFILE` | `cuda` | Target device profile |
| `QWEN_INFERENCE_TOKEN` | (empty) | Shared secret for future authenticated calls |

To use a local `.env` file, copy the example and pass it to `uv run`:

```bash
cp .env.example .env
uv run --env-file .env uvicorn offroadify_inference.app:app --host 127.0.0.1 --port 8000
```

Keep `.env` out of Git (it is ignored) and never put real tokens in
`.env.example`.

## Run the service

```bash
uv run uvicorn offroadify_inference.app:app --host 127.0.0.1 --port 8000
```

Check health:

```bash
curl http://127.0.0.1:8000/health
```

Expected response:

```json
{"status":"ok","model_loaded":false}
```

## Run tests

```bash
uv run pytest
```
