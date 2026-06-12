# Task: Prepare split web and GPU deployment

## Status

- [ ] planned
- [ ] in progress
- [ ] implemented
- [ ] reviewed
- [ ] done

## Goal

Prepare the Qwen service for deployment separately from the Vercel-hosted Next.js app.

## Target architecture

```text
Browser
  -> Vercel Next.js app
  -> /api/offroadify
  -> authenticated HTTPS request
  -> GPU-hosted Qwen service
  -> PNG response
```

A model running on the developer's localhost is not reachable from Vercel.

## Deliverables

- CUDA-compatible Dockerfile
- `.dockerignore`
- persistent Hugging Face cache strategy
- health check
- non-root execution where practical
- required service token for non-local binding
- documented measured GPU, RAM, disk, load-time, and generation-time requirements

## Requirements

- Do not bake weights into Git.
- Do not bake secrets into image layers.
- Bound GPU concurrency.
- Restrict CORS; the browser should not call the GPU service directly.
- Use HTTPS in deployment.
- Add application-layer rate limiting before public release.
- Document cost and cold-start tradeoffs.
- Do not deploy automatically.

## Acceptance criteria

- [ ] Container builds and sees GPU.
- [ ] Model cache persists across restarts.
- [ ] One authenticated edit succeeds.
- [ ] Browser never receives service token.
- [ ] Hosted architecture is documented.
