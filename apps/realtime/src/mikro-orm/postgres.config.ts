import { MetadataStorage } from '@mikro-orm/core';
import type { Options } from '@mikro-orm/postgresql';
import { PostgresAbstractEntity } from '@voiceflow/orm-designer';
import postgresConfig from '@voiceflow/orm-designer/postgres';

import type { EnvironmentVariables } from '@/app.env';

import { CacheAdapter } from './cache-adapter';

export const POSTGRES_ENTITIES = Object.values(MetadataStorage.getMetadata()).flatMap((meta) => {
  if (!meta.class) return [];
  if (!(meta.class.prototype instanceof PostgresAbstractEntity)) return [];

  return meta.class;
});

export const createPostgresConfig = (env: EnvironmentVariables): Options => ({
  ...postgresConfig,
  type: 'postgresql',
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  dbName: env.POSTGRES_DATABASE,
  user: env.POSTGRES_USERNAME,
  password: env.POSTGRES_PASSWORD,

  entities: POSTGRES_ENTITIES,

  cache: {
    ...postgresConfig.cache,
    adapter: CacheAdapter,
  },
});
