import { Utils } from '@voiceflow/common';
import cbor from 'cbor';
import { describe, expect, it, vi } from 'vitest';

import { MOCK_ACTION, MOCK_CONTEXT } from './_fixtures';
import { PubSub } from './pubsub';

const MOCK_PAYLOAD = [MOCK_ACTION, MOCK_CONTEXT];
const MOCK_CHANNEL = 'mock_channel';
const CONFIG = {
  REDIS_CLUSTER_PORT: 9090,
  REDIS_CLUSTER_HOST: 'localhost',
};

describe('Client | PubSub', () => {
  describe('publish()', () => {
    it('publishes an encoded message to a channel', async () => {
      const message = await cbor.encodeAsync(MOCK_PAYLOAD);
      const publisher = { publish: vi.fn() };
      const pubsub = new PubSub({ config: CONFIG, redis: publisher } as any);

      await pubsub.publish(MOCK_CHANNEL, MOCK_PAYLOAD);
      pubsub.subscriber.disconnect();

      expect(publisher.publish).toBeCalledWith(MOCK_CHANNEL, message);
    });
  });

  describe('subscribe()', () => {
    it('subscribes to a channel', () => {
      const logger = { info: Utils.functional.noop, error: Utils.functional.noop };
      const handler = vi.fn();
      const subscriber = { subscribe: vi.fn(), on: vi.fn() };
      const pubsub = new PubSub({ config: CONFIG, redis: {}, log: logger } as any);
      pubsub.subscriber.disconnect();
      pubsub.subscriber = subscriber as any;

      pubsub.subscribe(MOCK_CHANNEL, handler);

      expect(subscriber.subscribe).toBeCalledWith(MOCK_CHANNEL);
      expect(subscriber.on).toBeCalledWith('messageBuffer', expect.any(Function));
    });

    it('handles encoded message', async () => {
      const message = await cbor.encodeAsync(MOCK_PAYLOAD);
      const logger = { info: Utils.functional.noop, error: vi.fn() };
      const handler = vi.fn();
      const subscriber = { subscribe: vi.fn(), on: vi.fn() };
      const pubsub = new PubSub({ config: CONFIG, redis: {}, log: logger } as any);
      pubsub.subscriber.disconnect();
      pubsub.subscriber = subscriber as any;

      pubsub.subscribe(MOCK_CHANNEL, handler);
      await subscriber.on.mock.calls[0][1](Buffer.from(MOCK_CHANNEL), message);

      expect(logger.error).not.toBeCalled();
      expect(handler).toBeCalledWith(MOCK_PAYLOAD);
    });

    it('returns unsubscribe callback', () => {
      const logger = { info: Utils.functional.noop, error: Utils.functional.noop };
      const handler = vi.fn();
      const subscriber = { subscribe: vi.fn(), unsubscribe: vi.fn(), on: vi.fn(), off: vi.fn() };
      const pubsub = new PubSub({ config: CONFIG, redis: {}, log: logger } as any);
      pubsub.subscriber.disconnect();
      pubsub.subscriber = subscriber as any;

      pubsub.subscribe(MOCK_CHANNEL, handler)();

      expect(subscriber.off).toBeCalledWith('messageBuffer', expect.any(Function));
      expect(subscriber.unsubscribe).toBeCalledWith(MOCK_CHANNEL);
    });
  });
});
