import cbor from 'cbor';
import IORedis from 'ioredis';

import { RedisConfig } from './redis';
import { BaseClientOptions } from './types';

export interface PubSub {
  publish: (channel: string, message: any) => void;

  subscribe: <T>(channel: string, handler: (message: T) => void) => () => void;
}

export interface PubSubClientOptions extends BaseClientOptions<RedisConfig> {
  redis: IORedis.Redis;
}

export const PubSubClient = ({ config, redis: publisher, log }: PubSubClientOptions): PubSub => {
  const subscriber = new IORedis(config.REDIS_CLUSTER_PORT, config.REDIS_CLUSTER_HOST);

  return {
    publish: (channel, message) => publisher.publishBuffer(channel, cbor.encode(message)),

    subscribe: (channel, handler) => {
      log.info(`subscribing to pubsub channel: '${channel}'`);

      const handleMessage = (channelBuffer: Buffer, messageBuffer: Buffer) => {
        if (channelBuffer.toString('utf8') !== channel) return;

        try {
          handler(cbor.decodeFirstSync(messageBuffer));
        } catch {
          log.error(`failed to decode pubsub message: '${messageBuffer.toString('utf8')}'`);
        }
      };

      subscriber.subscribe(channel);
      subscriber.on('messageBuffer', handleMessage);

      return () => {
        subscriber.off('messageBuffer', handleMessage);
        subscriber.unsubscribe(channel);
      };
    },
  };
};
