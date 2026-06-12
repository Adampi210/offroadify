export interface OffroadImageInput {
  /** Raw bytes of the user's uploaded car photo. */
  imageBytes: Uint8Array;
}

export interface OffroadImageResult {
  /** Binary PNG data of the generated image. */
  imageBytes: Uint8Array;
  mimeType: "image/png";
}

/**
 * Internal error for configuration or provider failures. The message is safe
 * to log server-side but must not be sent to the client verbatim.
 */
export class ImageGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageGenerationError";
  }
}
