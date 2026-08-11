/**
 * Canonical site URL for sitemap / robots / Open Graph.
 * Prefer NEXT_PUBLIC_SITE_URL in production (no trailing slash).
 */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    "https://aaruwealth.com";
  return raw.replace(/\/$/, "");
}
