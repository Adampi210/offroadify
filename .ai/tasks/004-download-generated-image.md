# Task: Add generated-image download

## Goal

Add a download action after successful generation.

## Non-goals

- No server storage, gallery, account, sharing, or metadata editing

## Acceptance criteria

- [ ] Download control appears only after success.
- [ ] Clicking it saves the result with a sensible filename.
- [ ] The downloaded file opens correctly.
- [ ] No dependency is added.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
