# Task: Expose Qwen editing through a local HTTP endpoint

## Status

- [ ] planned
- [ ] in progress
- [ ] implemented
- [ ] reviewed
- [ ] done

## Goal

Expose the proven Qwen pipeline through FastAPI.

## Endpoint

```text
POST /v1/edit
Content-Type: multipart/form-data
```

Fields:

```text
image: File
prompt: string
seed: integer, optional
```

Success:

```text
Content-Type: image/png
Body: PNG bytes
```

## Requirements

- Load the model once and reuse it.
- Reuse the Task 007 loader and defaults.
- Accept JPG, PNG, and WebP.
- Validate file presence, MIME type, byte size, decodability, dimensions, and prompt length.
- Normalize input to RGB.
- Serialize GPU inference with a semaphore/lock of size one.
- Require `Authorization: Bearer <token>` when `QWEN_INFERENCE_TOKEN` is non-empty.
- Allow tokenless use only while bound to `127.0.0.1`.
- Return safe errors for invalid input, unauthorized access, busy service, OOM, unavailable model, and inference failure.
- Do not persist images.
- Add tests with the model mocked; default tests must not load Qwen.
- Do not modify Next.js.
- Do not commit or push automatically.

## Health/readiness

Update `/health` to report model state and device. Optionally add `/ready` that succeeds only after model load.

## Acceptance criteria

- [ ] Valid multipart request returns PNG.
- [ ] Invalid images are rejected safely.
- [ ] Authentication works when configured.
- [ ] GPU concurrency is bounded.
- [ ] Model is not reloaded per request.
- [ ] Tests do not download the model.

## Manual test

```bash
curl -X POST   -H "Authorization: Bearer $QWEN_INFERENCE_TOKEN"   -F "image=@/absolute/path/to/car.jpg"   -F "prompt=Transform this exact car into a realistic off-road build while preserving identity, viewpoint, paint, lighting, and background."   -F "seed=0"   http://127.0.0.1:8000/v1/edit   --output qwen-result.png
```
