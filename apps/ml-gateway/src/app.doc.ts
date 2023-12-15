import { RedisManager } from '@liaoliaots/nestjs-redis';
import { REDIS_CLIENTS } from '@liaoliaots/nestjs-redis/dist/redis/redis.constants.js';
import type { TestingModuleBuilder } from '@nestjs/testing';
import { getStorageToken, ThrottlerStorageService } from '@nestjs/throttler';
import { createDocumentation } from '@voiceflow/nestjs-common';
import { Redis } from 'ioredis';

import { APP_NAME } from './config';

export const Documentation = createDocumentation(APP_NAME)
  .setDescription('ml-gateway API service')
  .addServer('https://ml-gateway.voiceflow.com')
  .build();

export const overrideProviders = (builder: TestingModuleBuilder) => {
  // Object.setPrototypeOf is required to mock Redis.prototype, otherwise nestjs-throttler-storage-redis creates a new instance of Redis
  builder.overrideProvider(RedisManager).useValue({ getClient: () => Object.setPrototypeOf({}, Redis.prototype) });
  builder.overrideProvider(getStorageToken()).useValue(ThrottlerStorageService);
  builder.overrideProvider(REDIS_CLIENTS).useValue({});
};
