# Architecture

## MVP overview

```text
Browser
  ↓ multipart/form-data
Next.js server route
  ↓ authenticated provider request
Image-editing API
  ↓ generated image
Next.js server route
  ↓ safe response
Browser
```

## Frontend

Responsibilities:

- Select one image
- Show local preview
- Submit to `/api/offroadify`
- Show loading/error state
- Display and download result

Likely files:

```text
app/page.tsx
components/offroadify-form.tsx   # only if extraction improves clarity
components/image-panel.tsx       # only if extraction improves clarity
```

## Backend

Endpoint:

```text
POST /api/offroadify
```

Request:

```text
multipart/form-data
image: File
```

Success response:

```json
{ "imageUrl": "<generated image representation>" }
```

Failure response:

```json
{ "error": "<safe user-facing message>" }
```

Responsibilities:

- Validate image presence, MIME type, and size
- Read `OPENAI_API_KEY` server-side
- Use the fixed MVP prompt
- Call the image-editing provider
- Return safe output without storing images

Likely file:

```text
app/api/offroadify/route.ts
```

## Persistence

No database or object storage in the first MVP.

## Expected failures

- Missing/unsupported/oversized file
- Missing API key
- Provider authentication/rate-limit/timeout/generation failure
- Malformed provider response
- Network interruption

## Future changes

Storage, queues, accounts, custom model serving, local inference, and 3D pipelines are later architecture phases.
