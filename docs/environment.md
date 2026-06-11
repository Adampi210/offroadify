# Environment variables

Local secrets belong in `.env.local`:

```text
OPENAI_API_KEY=<real key>
```

Commit an `.env.example` containing only:

```text
OPENAI_API_KEY=
```

Rules:

- Never commit `.env.local`.
- Never access this variable from a client component.
- Never log it.
- Rotate it immediately if exposed.
