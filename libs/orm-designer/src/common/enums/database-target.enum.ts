export const DatabaseTarget = {
  MONGO: 'mongo',
  POSTGRES: 'postgres',
} as const;

export type DatabaseTarget = (typeof DatabaseTarget)[keyof typeof DatabaseTarget];
