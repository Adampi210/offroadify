# Task: Switch Offroadify to Qwen local inference and verify end to end

## Status

- [ ] planned
- [ ] in progress
- [ ] implemented
- [ ] reviewed
- [ ] done

## Goal

Configure the app to use Qwen locally and verify upload -> generation -> display -> download without changing the browser contract.

## Local processes

Terminal 1:

```bash
cd services/qwen-inference
uv run uvicorn offroadify_inference.app:app --host 127.0.0.1 --port 8000
```

Terminal 2:

```bash
pnpm dev
```

## Next.js `.env.local`

```text
IMAGE_PROVIDER=qwen-local
QWEN_INFERENCE_URL=http://127.0.0.1:8000
QWEN_INFERENCE_TOKEN=
QWEN_INFERENCE_TIMEOUT_MS=300000
```

## Requirements

- Keep browser request to `POST /api/offroadify` unchanged.
- Route through the provider selector.
- Use the fixed Offroadify prompt.
- Preserve long-running loading state.
- Map service unavailable, timeout, busy, and OOM failures to safe user messages.
- Keep Cloudflare available only through explicit configuration.
- Update architecture and two-process local-run docs.
- Do not commit `.env.local`.
- Do not commit or push automatically.

## Acceptance criteria

- [ ] Both services start.
- [ ] Browser generation uses Qwen, not Cloudflare.
- [ ] Result displays and downloads.
- [ ] Stopping Python service produces a safe error.
- [ ] Timeout produces a safe error.
- [ ] Concurrent requests do not create uncontrolled GPU work.
- [ ] TypeScript checks and Python tests pass.

## Quality record

For at least ten images, record seed, runtime, resolution, identity preservation, viewpoint preservation, background preservation, off-road edit quality, artifacts, and GPU memory behavior.
