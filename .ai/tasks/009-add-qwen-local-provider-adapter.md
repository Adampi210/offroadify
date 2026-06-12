# Task: Add a Qwen-local provider adapter to Next.js

## Status

- [ ] planned
- [ ] in progress
- [ ] implemented
- [ ] reviewed
- [ ] done

## Goal

Add a server-only TypeScript adapter that calls the local Qwen service while preserving the existing provider-independent generation contract and public `/api/offroadify` route.

Keep the Cloudflare adapter temporarily as a fallback and comparison baseline.

## Proposed files

```text
lib/image-generation/qwen-local.ts
lib/image-generation/provider.ts
```

## Environment variables

```text
IMAGE_PROVIDER=qwen-local
QWEN_INFERENCE_URL=http://127.0.0.1:8000
QWEN_INFERENCE_TOKEN=
QWEN_INFERENCE_TIMEOUT_MS=300000
```

Keep existing Cloudflare variables for now.

## Provider selection

Support only an explicit server-side switch:

```text
cloudflare
qwen-local
```

Do not expose this choice in the browser and do not build a generic plugin registry.

## Adapter behavior

- Build `FormData`.
- Attach image as a `Blob`.
- Attach prompt.
- Call `${QWEN_INFERENCE_URL}/v1/edit`.
- Add Bearer auth when configured.
- Enforce timeout with `AbortController`.
- Validate image response type.
- Return binary bytes using the shared provider-independent type.
- Map local-service errors into existing internal provider errors.

## Requirements

- Use built-in `fetch`.
- Server-only code.
- No frontend change.
- No public API contract change.
- No new HTTP dependency.
- Do not delete Cloudflare yet.
- Do not commit or push automatically.

## Acceptance criteria

- [ ] Qwen adapter exists.
- [ ] Timeout and optional auth work.
- [ ] Provider selector supports both implementations.
- [ ] Binary PNG response is normalized.
- [ ] Browser bundle contains no inference token.
- [ ] Lint, typecheck, and build pass.
