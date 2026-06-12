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

export async function generateOffroadImage(
  input: OffroadImageInput,
): Promise<OffroadImageResult> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!accountId || !apiToken) {
    throw new ImageGenerationError(
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
      `Cloudflare request failed: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }

  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 200);
    throw new ImageGenerationError(
      `Cloudflare returned HTTP ${response.status}.${detail ? ` Body: ${detail}` : ""}`,
    );
  }

  const imageBytes = new Uint8Array(await response.arrayBuffer());
  if (imageBytes.length === 0) {
    throw new ImageGenerationError("Cloudflare returned an empty image.");
  }

  return { imageBytes, mimeType: "image/png" };
}
