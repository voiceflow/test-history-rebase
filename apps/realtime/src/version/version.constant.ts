export const VersionIDAlias = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
} as const;

export type VersionIDAlias = (typeof VersionIDAlias)[keyof typeof VersionIDAlias];
