import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const PROVIDER_URL = "https://api.openai.com/v1/images/edits";
const PROVIDER_TIMEOUT_MS = 120_000;

const FIXED_PROMPT =
  "Transform the car in the uploaded image into a realistic off-road version of the same vehicle. Preserve the vehicle identity, body shape, camera angle, perspective, lighting, and background. Add realistic all-terrain tires, increased ground clearance, subtle fender flares, protective skid plates, and a practical roof rack. Keep the result photorealistic and physically plausible. Do not add text, watermarks, people, or unrelated objects.";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is not set.");
    return errorResponse("Image generation is not configured.", 500);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse('Send multipart form data with an "image" file.', 400);
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return errorResponse('Attach one image file in the "image" field.', 400);
  }
  if (!ACCEPTED_TYPES.includes(image.type)) {
    return errorResponse("Unsupported file type. Use JPG, PNG, or WebP.", 400);
  }
  if (image.size > MAX_FILE_SIZE_BYTES) {
    return errorResponse("Image is too large. Maximum size is 10 MB.", 400);
  }

  const providerForm = new FormData();
  providerForm.append("model", "gpt-image-1");
  providerForm.append("prompt", FIXED_PROMPT);
  providerForm.append("image", image, image.name || "car-image");

  let providerResponse: Response;
  try {
    providerResponse = await fetch(PROVIDER_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: providerForm,
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
  } catch (error) {
    console.error("Image provider request failed:", error);
    return errorResponse("Image generation failed. Please try again.", 502);
  }

  if (!providerResponse.ok) {
    console.error(`Image provider returned HTTP ${providerResponse.status}.`);
    return errorResponse("Image generation failed. Please try again.", 502);
  }

  let generatedBase64: string | undefined;
  try {
    const payload = (await providerResponse.json()) as {
      data?: Array<{ b64_json?: string }>;
    };
    generatedBase64 = payload.data?.[0]?.b64_json;
  } catch {
    generatedBase64 = undefined;
  }

  if (!generatedBase64) {
    console.error("Image provider returned an unexpected response shape.");
    return errorResponse("Image generation failed. Please try again.", 502);
  }

  return NextResponse.json({
    imageUrl: `data:image/png;base64,${generatedBase64}`,
  });
}
