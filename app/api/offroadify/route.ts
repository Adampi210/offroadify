import { NextResponse } from "next/server";
import { generateOffroadImage } from "@/lib/image-generation/cloudflare";
import { getImageDimensions } from "@/lib/image-generation/dimensions";
import {
  ImageGenerationError,
  type OffroadImageResult,
} from "@/lib/image-generation/types";

export const runtime = "nodejs";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
// Conservative prototype limit (also documented in docs/architecture.md).
// Cloudflare receives the image base64-encoded, so payloads grow by ~33%.
const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return errorResponse('Send multipart form data with an "image" file.', 400);
  }

  const image = formData.get("image");
  if (!(image instanceof File) || image.size === 0) {
    return errorResponse("A supported image file is required.", 400);
  }
  if (!ACCEPTED_TYPES.includes(image.type)) {
    return errorResponse("Unsupported file type. Use JPG, PNG, or WebP.", 400);
  }
  if (image.size > MAX_UPLOAD_SIZE_BYTES) {
    return errorResponse("Image is too large. Maximum size is 5 MB.", 400);
  }

  let result: OffroadImageResult;
  try {
    const imageBytes = new Uint8Array(await image.arrayBuffer());
    // Keep the output at the source size and aspect ratio when parseable;
    // otherwise the provider falls back to its default output size.
    const dimensions = getImageDimensions(imageBytes);
    result = await generateOffroadImage({ imageBytes, ...dimensions });
  } catch (error) {
    if (error instanceof ImageGenerationError) {
      console.error(`Image generation failed (${error.kind}): ${error.message}`);
      if (error.kind === "configuration") {
        return errorResponse("Image generation is not configured.", 500);
      }
      return errorResponse("Image generation failed. Please try again.", 502);
    }
    console.error(
      `Unexpected image generation error: ${error instanceof Error ? error.message : "unknown"}`,
    );
    return errorResponse("Something went wrong. Please try again.", 500);
  }

  return new Response(result.imageBytes, {
    status: 200,
    headers: {
      "Content-Type": result.mimeType,
      "Content-Length": String(result.imageBytes.byteLength),
      "Cache-Control": "no-store",
    },
  });
}
