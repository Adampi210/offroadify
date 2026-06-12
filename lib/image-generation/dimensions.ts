/**
 * Minimal dimension parsing for JPEG, PNG, and WebP uploads. Returns null for
 * anything it cannot parse; callers must treat that as "dimensions unknown".
 */
export interface ImageDimensions {
  width: number;
  height: number;
}

export function getImageDimensions(bytes: Uint8Array): ImageDimensions | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  try {
    let dimensions: ImageDimensions | null = null;
    if (isPng(bytes)) dimensions = parsePng(view);
    else if (isJpeg(bytes)) dimensions = parseJpeg(view);
    else if (isWebp(bytes)) dimensions = parseWebp(view);
    if (dimensions && dimensions.width > 0 && dimensions.height > 0) {
      return dimensions;
    }
  } catch {
    // Truncated or malformed file; treat as unknown.
  }
  return null;
}

function isPng(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 24 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  );
}

function parsePng(view: DataView): ImageDimensions {
  // 8-byte signature, 4-byte chunk length, "IHDR", then width and height.
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8;
}

function parseJpeg(view: DataView): ImageDimensions | null {
  let offset = 2;
  while (offset + 9 < view.byteLength) {
    if (view.getUint8(offset) !== 0xff) return null;
    const marker = view.getUint8(offset + 1);
    // Standalone markers (RST0-7, TEM) have no length field.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    // SOF0-SOF15 hold dimensions, except DHT (C4), JPG (C8), DAC (CC).
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    if (isSof) {
      return {
        height: view.getUint16(offset + 5),
        width: view.getUint16(offset + 7),
      };
    }
    offset += 2 + view.getUint16(offset + 2);
  }
  return null;
}

function isWebp(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 30 &&
    bytes[0] === 0x52 && // RIFF
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 && // WEBP
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

function parseWebp(view: DataView): ImageDimensions | null {
  const chunkType = String.fromCharCode(
    view.getUint8(12),
    view.getUint8(13),
    view.getUint8(14),
    view.getUint8(15),
  );
  if (chunkType === "VP8 ") {
    // Lossy: dimensions follow the 3-byte frame tag and 3-byte sync code.
    return {
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
    };
  }
  if (chunkType === "VP8L") {
    // Lossless: 14-bit width and height packed after the signature byte.
    const bits = view.getUint32(21, true);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  if (chunkType === "VP8X") {
    // Extended: 24-bit little-endian canvas size minus one.
    const read24 = (at: number) =>
      view.getUint8(at) | (view.getUint8(at + 1) << 8) | (view.getUint8(at + 2) << 16);
    return { width: read24(24) + 1, height: read24(27) + 1 };
  }
  return null;
}
