/**
 * Hosts that next/image may optimize. Notion serves uploaded files from
 * signed S3 URLs; covers picked from Notion's gallery come from Unsplash.
 * Images from any other host are rendered unoptimized.
 */
export const REMOTE_IMAGE_HOSTS = [
  "**.amazonaws.com",
  "**.notion.so",
  "**.notion-static.com",
  "images.unsplash.com",
] as const;

export function isOptimizableImage(src: string): boolean {
  let hostname: string;
  try {
    hostname = new URL(src).hostname;
  } catch {
    return false;
  }
  return REMOTE_IMAGE_HOSTS.some((pattern) =>
    pattern.startsWith("**.") ? hostname.endsWith(pattern.slice(2)) : hostname === pattern,
  );
}
