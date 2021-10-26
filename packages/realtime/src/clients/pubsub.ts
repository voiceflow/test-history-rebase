import cbor from 'cbor';
import IORedis from 'ioredis';

import logger from '@/logger';

import { BaseOptions } from './types';

export interface PubSub {
  publish: (channel: string, message: any) => void;

  subscribe: <T>(channel: string, handler: (message: T) => void) => () => void;
}

export interface PubSubClientOptions extends BaseOptions {
  redis: IORedis.Redis;
}

const Client = ({ config, redis: publisher }: PubSubClientOptions): PubSub => {
  const subscriber = new IORedis(config.REDIS_CLUSTER_PORT, config.REDIS_CLUSTER_HOST);

  return {
    publish: (channel, message) => publisher.publishBuffer(channel, cbor.encode(message)),

    subscribe: (channel, handler) => {
      logger.info(`subscribing to pubsub channel: '${channel}'`);

      const handleMessage = (channelBuffer: Buffer, messageBuffer: Buffer) => {
        if (channelBuffer.toString('utf8') !== channel) return;

        try {
          handler(cbor.decodeFirstSync(messageBuffer));
        } catch {
          logger.error(`failed to decode pubsub message: '${messageBuffer.toString('utf8')}'`);
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

export default Client;
