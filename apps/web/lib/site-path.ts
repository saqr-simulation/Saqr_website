/** Prefix public URLs when hosted under a GitHub Pages repository path. */
export function sitePath(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${base}${path}`;
}
export const platformAvailable =
  process.env.NEXT_PUBLIC_STATIC_EXPORT !== 'true' ||
  Boolean(process.env.NEXT_PUBLIC_PLATFORM_URL);
