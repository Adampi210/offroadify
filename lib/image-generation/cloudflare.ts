// Server-only module: reads Cloudflare credentials from process.env.
// Never import this from client components.
import { OFFROAD_PROMPT } from "./prompt";
import {
  ImageGenerationError,
  type OffroadImageInput,
  type OffroadImageResult,
} from "./types";

const MODEL = "@cf/runwayml/stable-diffusion-v1-5-img2img";
const NUM_STEPS = 20;
const STRENGTH = 0.65;
const GUIDANCE = 7.5;
const REQUEST_TIMEOUT_MS = 120_000;
// Workers AI accepts output dimensions between 256 and 2048. Stable Diffusion
// works on a multiple-of-8 pixel grid, so requested sizes snap to it.
const MIN_OUTPUT_DIM = 256;
const MAX_OUTPUT_DIM = 2048;
const OUTPUT_DIM_GRID = 8;

function toModelDimensions(width: number, height: number) {
  const scale = Math.min(1, MAX_OUTPUT_DIM / Math.max(width, height));
  const snap = (value: number) =>
    Math.min(
      MAX_OUTPUT_DIM,
      Math.max(
        MIN_OUTPUT_DIM,
        Math.round((value * scale) / OUTPUT_DIM_GRID) * OUTPUT_DIM_GRID,
      ),
    );
  // This model applies the two parameters transposed (verified empirically:
  // requesting 800x600 yields a 600x800 image), so send them swapped.
  return { width: snap(height), height: snap(width) };
}

export async function generateOffroadImage(
  input: OffroadImageInput,
): Promise<OffroadImageResult> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    throw new ImageGenerationError(
      "configuration",
      "Cloudflare credentials are missing. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN.",
    );
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${MODEL}`;
  const body = JSON.stringify({
    prompt: OFFROAD_PROMPT,
    image_b64: Buffer.from(input.imageBytes).toString("base64"),
    num_steps: NUM_STEPS,
    strength: STRENGTH,
    guidance: GUIDANCE,
    ...(input.width && input.height
      ? toModelDimensions(input.width, input.height)
      : {}),
  });

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new ImageGenerationError(
      "provider",
      `Cloudflare request failed: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }

  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 200);
    throw new ImageGenerationError(
      "provider",
      `Cloudflare returned HTTP ${response.status}.${detail ? ` Body: ${detail}` : ""}`,
    );
  }

  const imageBytes = new Uint8Array(await response.arrayBuffer());
  if (imageBytes.length === 0) {
    throw new ImageGenerationError(
      "provider",
      "Cloudflare returned an empty image.",
    );
  }

  return { imageBytes, mimeType: "image/png" };
}
