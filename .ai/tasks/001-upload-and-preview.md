# Task: Add image selection and local preview

## Status

- [x] planned
- [ ] in progress
- [ ] implemented
- [ ] reviewed
- [ ] done

## Goal

Replace the default Next.js starter page with a minimal Offroadify interface that lets the user select one car image and preview it locally.

## Non-goals

- No backend or API call
- No generated image or download
- No database, auth, presets, or 3D
- No new dependencies

## Likely files to change

- `app/page.tsx`
- `app/globals.css` only if needed

## Behavior contract

User action:

> Select one JPG, PNG, or WebP image.

Expected behavior:

> Show it in an Original preview panel and clearly state that generation is not connected yet.

## Implementation notes

- Use a client component.
- Use `URL.createObjectURL`.
- Revoke old object URLs when no longer needed.
- Keep the page simple and responsive.

## Acceptance criteria

- [ ] Default starter content is gone.
- [ ] Product name and purpose are clear.
- [ ] One JPG, PNG, or WebP can be selected.
- [ ] Selected image is previewed.
- [ ] Selecting another image replaces it.
- [ ] Generation action is clearly inactive.
- [ ] No API request occurs.
- [ ] No dependency is added.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Manual test plan

1. Run `pnpm dev`.
2. Open `http://localhost:3000`.
3. Select two different images in succession.
4. Resize the browser and check readability.
