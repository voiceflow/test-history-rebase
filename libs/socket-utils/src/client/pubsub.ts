import type { Logger } from '@voiceflow/logger';
import cbor from 'cbor';
import type { Redis } from 'ioredis';
import IORedis from 'ioredis';

import type { RedisConfig } from './redis';
import type { BaseClientOptions } from './types';

export interface PubSubOptions extends BaseClientOptions<RedisConfig> {
  redis: Redis;
  lazyConnect?: boolean;
}

export class PubSub {
  log: Logger;

  publisher: Redis;

  subscriber: Redis;

  constructor({ config, redis: publisher, log, lazyConnect }: PubSubOptions) {
    this.log = log;
    this.publisher = publisher;
    this.subscriber = new IORedis({
      port: config.REDIS_CLUSTER_PORT,
      host: config.REDIS_CLUSTER_HOST,
      lazyConnect,
    });
  }

  setup() {
    return this.subscriber.connect();
  }

  destroy() {
    return this.subscriber.quit();
  }

  async publish(channel: string, message: any): Promise<void> {
    const messageBuffer = await cbor.encodeAsync(message);

    this.publisher.publish(channel, messageBuffer);
  }

  subscribe<T>(channel: string, handler: (message: T) => void): () => void {
    this.log.info(`subscribing to pubsub channel: '${channel}'`);

    const handleMessage = async (channelBuffer: Buffer, messageBuffer: Buffer) => {
      if (channelBuffer.toString('utf8') !== channel) return;

      try {
        const message = await cbor.decodeFirst(messageBuffer);

        handler(message);
      } catch {
        this.log.error(`failed to decode pubsub message: '${messageBuffer.toString('utf8')}'`);
      }
    };

    this.subscriber.subscribe(channel);
    this.subscriber.on('messageBuffer', handleMessage);

    return () => {
      this.subscriber.off('messageBuffer', handleMessage);
      this.subscriber.unsubscribe(channel);
    };
  }
}
