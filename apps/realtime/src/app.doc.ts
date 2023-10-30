import { RedisManager } from '@liaoliaots/nestjs-redis';
import { REDIS_CLIENTS } from '@liaoliaots/nestjs-redis/dist/redis/redis.constants.js';
import { getMikroORMToken, getRepositoryToken } from '@mikro-orm/nestjs';
import type { TestingModuleBuilder } from '@nestjs/testing';
import { createDocumentation } from '@voiceflow/nestjs-common';
import { DatabaseTarget } from '@voiceflow/orm-designer';

import { APP_NAME } from './config';
import { MONGO_ENTITIES } from './mikro-orm/mongo.config';
import { POSTGRES_ENTITIES } from './mikro-orm/postgres.config';

const ENTITIES = {
  [DatabaseTarget.MONGO]: MONGO_ENTITIES,
  [DatabaseTarget.POSTGRES]: POSTGRES_ENTITIES,
};

export const Documentation = createDocumentation(APP_NAME)
  .setDescription('Realtime gateway API service')
  .addServer('https://realtime.voiceflow.com')
  .build();

export const overrideProviders = (builder: TestingModuleBuilder) => {
  builder.overrideProvider(RedisManager).useValue({ getClient: () => ({}) });
  builder.overrideProvider(REDIS_CLIENTS).useValue({});

  Object.entries(ENTITIES).forEach(([target, entities]) => {
    builder.overrideProvider(getMikroORMToken(target)).useValue({});

    entities.forEach((entity) => builder.overrideProvider(getRepositoryToken(entity.name, target)).useValue({}));
  });
};
