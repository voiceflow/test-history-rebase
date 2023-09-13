import { Logger } from '@voiceflow/logger';
import cbor from 'cbor';
import IORedis from 'ioredis';

import { RedisConfig } from './redis';
import { BaseClientOptions } from './types';

export interface PubSubOptions extends BaseClientOptions<RedisConfig> {
  redis: IORedis.Redis;
}

export class PubSub {
  log: Logger;

  publisher: IORedis.Redis;

  subscriber: IORedis.Redis;

  constructor({ config, redis: publisher, log }: PubSubOptions) {
    this.log = log;
    this.publisher = publisher;
    this.subscriber = new IORedis(config.REDIS_CLUSTER_PORT, config.REDIS_CLUSTER_HOST);
  }

  async publish(channel: string, message: any): Promise<void> {
    const messageBuffer = await cbor.encodeAsync(message);

    this.publisher.publishBuffer(channel, messageBuffer);
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
