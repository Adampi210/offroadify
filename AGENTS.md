# AGENTS.md

This is the canonical project instruction file for AI coding assistants working on Offroadify.

## Project summary

**Offroadify** is a web app that accepts a photo of a car, generates an off-road-modified version of the same car through an image-editing API, and lets the user download the generated image.

## Current stage

Early prototype / MVP.

## Current goal

Build the smallest complete vertical slice:

1. User selects a car image.
2. The browser previews it.
3. The frontend sends it to a server-side API route.
4. The server calls an image-editing API with one fixed prompt.
5. The generated image is returned.
6. The user can download it.

## Current stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Next.js Route Handlers on Node.js
- pnpm
- External image-editing API for the first prototype
- Vercel later, after the MVP works locally

## Non-negotiable rules

1. Never expose API keys to client-side code.
2. Keep changes small and reviewable.
3. Prefer simple, explicit code.
4. Do not add dependencies without explaining why.
5. Do not add auth, database, storage, payments, analytics, 3D, or custom-model infrastructure unless the active task requests it.
6. Treat uploaded files as untrusted input.
7. Validate file type and size on the server.
8. Do not claim completion until relevant checks pass or failures are documented.
9. Do not commit or push unless explicitly asked.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Current scope

In scope:

- One image upload
- Local preview
- One fixed prompt
- One server-side image-editing API call
- Loading and error states
- Generated-image display
- Download action

Out of scope:

- Accounts, database, gallery, payments
- Multiple styles or editable prompts
- Neutral backgrounds and masks
- 3D or multiple views
- Custom training and local inference

## Fixed MVP prompt

```text
Transform the car in the uploaded image into a realistic off-road version of the same vehicle. Preserve the vehicle identity, body shape, camera angle, perspective, lighting, and background. Add realistic all-terrain tires, increased ground clearance, subtle fender flares, protective skid plates, and a practical roof rack. Keep the result photorealistic and physically plausible. Do not add text, watermarks, people, or unrelated objects.
```

## Client/server boundary

Client responsibilities:

- File selection and local preview
- Submit action
- Loading and error states
- Result display and download

Server responsibilities:

- Read `OPENAI_API_KEY`
- Receive and validate multipart form data
- Call the image-editing API
- Return a safe response
- Never expose secrets or internal stack traces

## AI workflow

For every task:

1. Read this file and `CLAUDE.md`.
2. Read the active task under `.ai/tasks/`.
3. Inspect existing files before editing.
4. Implement only the active task.
5. Run relevant checks.
6. Summarize changed files, behavior, check results, and remaining issues.
