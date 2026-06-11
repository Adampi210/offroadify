# Task: Add the server-side image-editing route

## Goal

Create `POST /api/offroadify` to accept one image, validate it, call the image-editing API with the fixed prompt from `AGENTS.md`, and return the generated result.

## Non-goals

- No frontend connection
- No persistence, auth, presets, retries, or 3D

## Likely files to change

- `app/api/offroadify/route.ts`
- `package.json` only if the official SDK must be installed
- `.env.example`

## Acceptance criteria

- [ ] Missing, unsupported, and oversized files return HTTP 400.
- [ ] API key is read server-side only.
- [ ] Valid requests call the provider.
- [ ] Successful response returns generated image data.
- [ ] Provider failures return a safe message.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
