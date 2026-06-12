# Environment variables

Local secrets belong in `.env.local`:

```text
OPENAI_API_KEY=<real key>
CLOUDFLARE_ACCOUNT_ID=<account id>
CLOUDFLARE_API_TOKEN=<real token>
```

Commit an `.env.example` containing only:

```text
OPENAI_API_KEY=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

`CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are required by
`POST /api/offroadify` (read only inside `lib/image-generation/cloudflare.ts`).

Rules:

- Never commit `.env.local`.
- Never access these variables from a client component.
- Never log them.
- Rotate them immediately if exposed.
