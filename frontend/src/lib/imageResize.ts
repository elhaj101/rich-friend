// Client-side image downscaling.
//
// Photos are captured in the browser, shrunk to a sane max dimension, and encoded
// as a JPEG data URL before being sent to the (mock) API as JSON. This keeps
// payloads to a few hundred KB and avoids multipart handling — a real backend
// would later accept a proper file upload here instead.

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.82;

export async function fileToResizedDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("not_an_image");
  }

  const bitmap = await loadImage(file);
  const { width, height } = bitmap;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no_canvas_context");
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);

  if ("close" in bitmap && typeof bitmap.close === "function") {
    bitmap.close();
  }

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

async function loadImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // Prefer createImageBitmap (fast, off-DOM); fall back to <img> where absent.
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall through to <img>
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}
