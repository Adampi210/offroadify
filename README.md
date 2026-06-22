# Offroadify

Offroadify is a web app that takes a photo of a car, generates an off-road–modified
version of the same vehicle through an image-editing API, and lets you download the
result.

Given an uploaded photo, it adds realistic all-terrain tires, increased ground
clearance, subtle fender flares, skid plates, and a roof rack — while preserving the
car's identity, body shape, camera angle, lighting, and background.

> **Status:** Early prototype / MVP. The smallest complete vertical slice: upload →
> preview → server-side generation → download.

## How it works

1. You select a car image in the browser.
2. The browser previews it locally.
3. The frontend posts the file to a server-side route, `POST /api/offroadify`.
4. The route validates the file, then calls an image-editing provider with one fixed
   prompt.
5. The generated image is streamed back and shown.
6. You download it.

The browser only ever calls `POST /api/offroadify`. Next.js owns upload validation,
prompt selection, provider selection, and safe error mapping; provider credentials
stay server-side.

## Tech stack

- Next.js (App Router) on Node.js route handlers
- React + TypeScript
- Tailwind CSS
- pnpm
- Cloudflare Workers AI as the current image-editing provider (temporary fallback
  until the local Qwen service is proven; see [Local inference](#local-inference))

## Getting started

Install dependencies:

```bash
pnpm install
```

Create a `.env.local` with the provider credentials (see [`.env.example`](.env.example)
and [`docs/environment.md`](docs/environment.md)):

```text
CLOUDFLARE_ACCOUNT_ID=<account id>
CLOUDFLARE_API_TOKEN=<real token>
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), choose a car photo, and generate.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Upload constraints

The server validates every upload:

- Accepted types: JPG, PNG, WebP
- Maximum size: 5 MB

Uploaded files are treated as untrusted input and are not persisted during the MVP.

## Local inference

A separate Python/PyTorch service under [`services/qwen-inference/`](services/qwen-inference/)
runs the `Qwen/Qwen-Image-Edit-2511` editing model. Qwen is never loaded inside
Next.js or a Vercel function; it lives behind the same stable `POST /api/offroadify`
boundary. Cloudflare remains the provider until the Qwen path is proven.

## Documentation

- [`docs/product.md`](docs/product.md) — product scope
- [`docs/architecture.md`](docs/architecture.md) — architecture and boundaries
- [`docs/environment.md`](docs/environment.md) — environment variables and secrets
- [`docs/commands.md`](docs/commands.md) — commands
- [`docs/roadmap.md`](docs/roadmap.md) — roadmap
- [`AGENTS.md`](AGENTS.md) — canonical instructions for AI coding assistants
