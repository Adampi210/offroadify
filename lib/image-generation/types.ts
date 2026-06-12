export interface OffroadImageInput {
  /** Raw bytes of the user's uploaded car photo. */
  imageBytes: Uint8Array<ArrayBuffer>;
  /**
   * Source dimensions, when known. The provider matches the output to them
   * (within model limits) instead of the model's default square size.
   */
  width?: number;
  height?: number;
}

export interface OffroadImageResult {
  /** Binary PNG data of the generated image. */
  imageBytes: Uint8Array<ArrayBuffer>;
  mimeType: "image/png";
}

/**
 * Internal error for configuration or provider failures. The message is safe
 * to log server-side but must not be sent to the client verbatim.
 *
 * `kind` lets callers map the failure to an HTTP status:
 * - "configuration": missing server configuration (e.g. credentials)
 * - "provider": the upstream image provider request failed
 */
export class ImageGenerationError extends Error {
  readonly kind: "configuration" | "provider";

  constructor(kind: "configuration" | "provider", message: string) {
    super(message);
    this.name = "ImageGenerationError";
    this.kind = kind;
  }
}
