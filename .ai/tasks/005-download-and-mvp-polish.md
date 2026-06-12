# Task: Add generated-image download and MVP usability polish

## Status

- [ ] planned
- [ ] in progress
- [ ] implemented
- [ ] reviewed
- [ ] done

## Goal

Allow the user to download the generated Offroadify image and apply only the small usability improvements needed to make the first local prototype feel complete.

## Context

The current prototype already supports:

- selecting a car image
- previewing the original image
- sending the image to `POST /api/offroadify`
- showing loading and error states
- displaying the generated image

This task completes the first local MVP by adding a download action and clarifying the current product limitations.

## Non-goals

- No user accounts
- No saved history or gallery
- No server-side image storage
- No social sharing
- No analytics
- No style presets
- No editable prompts
- No segmentation or background removal
- No 3D functionality
- No new dependencies
- No backend redesign

## Likely files to change

- `app/page.tsx`
- an existing frontend component if generated-image state was already extracted

The backend and provider adapter should not change unless a real incompatibility prevents downloading the existing binary response.

## Behavior contract

### Before generation

- No download control is shown.
- The user can select an image and generate a result normally.

### After successful generation

- The generated image remains visible.
- A clear download control appears.
- Clicking the control downloads the generated image currently displayed.
- The downloaded file uses a sensible filename such as:

```text
offroadified-car.png
```

### When selecting a new original image

- The previous generated result is cleared.
- The previous download control disappears.
- Any stale generated-image object URL is revoked.
- The user cannot accidentally download the previous result.

### Error behavior

- A failed generation does not show a download control.
- Existing generation error and retry behavior remains intact.

## Implementation requirements

1. Reuse the generated image `Blob` or object URL already created by the frontend.

2. Do not make another API request when the user downloads the result.

3. Prefer the simplest browser-native download mechanism.

A normal implementation may use:

```tsx
<a
  href={generatedImageUrl}
  download="offroadified-car.png"
>
  Download result
</a>
```

4. If the current implementation stores only the generated object URL, make only the smallest state change needed.

5. If storing the generated `Blob` makes the state clearer, that is acceptable, but do not redesign the full component.

6. Preserve all current behavior:

- file selection
- original preview
- generation request
- loading state
- error state
- retry behavior
- result preview
- object URL cleanup

7. Ensure generated-image object URLs are revoked:

- when replaced
- when a new original image is selected
- when the component unmounts

8. Add concise user-facing information explaining:

- supported input formats: JPG, PNG, and WebP
- the current maximum upload size enforced by the backend
- the prototype currently uses one fixed off-road transformation style
- results may vary because this is an early prototype

9. Keep accessibility basics:

- use a real link or button for downloading
- provide clear accessible text
- keep the control keyboard accessible
- use meaningful image alt text
- preserve understandable loading and error messages

10. Do not add a dependency for downloading or UI polish.

11. Do not commit or push automatically.

## Acceptance criteria

- [ ] A download control appears only after successful generation.
- [ ] Clicking it saves the currently displayed generated image.
- [ ] The downloaded file opens successfully.
- [ ] The downloaded file matches the generated preview.
- [ ] The file uses a sensible filename.
- [ ] No second API request is made during download.
- [ ] Selecting a new original image clears the previous generated result.
- [ ] Selecting a new image removes the previous download control.
- [ ] Stale generated object URLs are revoked.
- [ ] Supported formats and upload-size information are visible.
- [ ] Fixed-style and early-prototype limitations are communicated clearly.
- [ ] Existing loading, error, retry, and preview behavior still works.
- [ ] No new dependency is added.
- [ ] The page remains usable at mobile and desktop widths.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Manual test plan

1. Run `pnpm dev`.
2. Open `http://localhost:3000`.
3. Confirm no download control appears before generation.
4. Select a valid car image.
5. Generate a result.
6. Confirm the generated image appears.
7. Confirm a download control appears.
8. Download the file and confirm it opens.
9. Confirm the downloaded file matches the preview.
10. Select a different image.
11. Confirm the previous result and download control disappear.
12. Generate another result and confirm the new download works.
13. Trigger an error and confirm no download control appears.
14. Test the page at a narrow browser width.

## Risks / open questions

- The provider currently returns PNG output, so `.png` is the expected filename extension. If the provider later returns other formats, derive the filename extension from the MIME type.
- The browser `download` attribute should work reliably with the current Blob/object-URL approach.
