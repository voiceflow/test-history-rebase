import { MetadataStorage } from '@mikro-orm/core';
import type { Options } from '@mikro-orm/mongodb';
import { MongoEntity } from '@voiceflow/orm-designer';
import mongoConfig from '@voiceflow/orm-designer/mongo';

import type { EnvironmentVariables } from '@/app.env';

import { CacheAdapter } from './cache-adapter';

export const MONGO_ENTITIES = Object.values(MetadataStorage.getMetadata()).flatMap((meta) => {
  if (!meta.class) return [];
  if (!(meta.class.prototype instanceof MongoEntity)) return [];

  return meta.class;
});

export const createMongoConfig = (env: EnvironmentVariables): Options => ({
  ...mongoConfig,
  dbName: env.MONGO_DB,
  clientUrl: env.MONGO_URI,

  entities: MONGO_ENTITIES,

  metadataCache: {
    ...mongoConfig.metadataCache,
    adapter: CacheAdapter,
  },
});
