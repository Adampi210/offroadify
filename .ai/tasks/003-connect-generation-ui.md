# Task: Connect the upload UI to the API

## Goal

Submit the selected image to `/api/offroadify`, show loading and safe error states, and display the generated result.

## Non-goals

- No download yet
- No persistence, presets, auth, or editable prompt

## Acceptance criteria

- [ ] Button enables only when an image is selected.
- [ ] Request sends `FormData` to the API.
- [ ] Loading state prevents duplicate submissions.
- [ ] Success displays the generated image.
- [ ] Failure shows a useful error and allows retry.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```
