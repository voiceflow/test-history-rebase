export const ImportSitemapScreen = {
  SITEMAP: 'SITEMAP',
  REVIEW_URLS: 'REVIEW_URLS',
} as const;

export type ImportSitemapScreen = (typeof ImportSitemapScreen)[keyof typeof ImportSitemapScreen];
