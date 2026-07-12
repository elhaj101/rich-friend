// GitHub Pages serves this app from a /rich-friend subpath, but next/image and
// next/link already prefix that automatically. Raw string paths (CSS
// background-image, plain <img> tags) don't go through Next's asset pipeline,
// so they need this prefix applied manually to resolve under that subpath.
export const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string): string {
  return `${ASSET_PREFIX}${path}`;
}
