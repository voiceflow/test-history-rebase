import { PubSub } from '@socket-utils/client/pubsub';
import { Utils } from '@voiceflow/common';
import cbor from 'cbor';
import { expect } from 'chai';
import sinon from 'sinon';

import { MOCK_ACTION, MOCK_CONTEXT } from '../_fixtures';

const MOCK_PAYLOAD = [MOCK_ACTION, MOCK_CONTEXT];
const MOCK_CHANNEL = 'mock_channel';
const CONFIG = {
  REDIS_CLUSTER_PORT: Number(process.env.REDIS_CLUSTER_PORT),
  REDIS_CLUSTER_HOST: process.env.REDIS_CLUSTER_HOST,
};

describe('Client | PubSub', () => {
  beforeEach(() => sinon.restore());

  describe('publish()', () => {
    it('publishes an encoded message to a channel', async () => {
      const message = await cbor.encodeAsync(MOCK_PAYLOAD);
      const publisher = { publishBuffer: sinon.spy() };
      const pubsub = new PubSub({ config: CONFIG, redis: publisher } as any);

      await pubsub.publish(MOCK_CHANNEL, MOCK_PAYLOAD);
      pubsub.subscriber.disconnect();

      expect(publisher.publishBuffer).to.be.calledWithExactly(MOCK_CHANNEL, message);
    });
  });

  describe('subscribe()', () => {
    it('subscribes to a channel', () => {
      const logger = { info: Utils.functional.noop, error: Utils.functional.noop };
      const handler = sinon.spy();
      const subscriber = { subscribe: sinon.spy(), on: sinon.spy() };
      const pubsub = new PubSub({ config: CONFIG, redis: {}, log: logger } as any);
      pubsub.subscriber.disconnect();
      pubsub.subscriber = subscriber as any;

      pubsub.subscribe(MOCK_CHANNEL, handler);

      expect(subscriber.subscribe).to.be.calledWithExactly(MOCK_CHANNEL);
      expect(subscriber.on).to.be.calledWithExactly('messageBuffer', sinon.match.func);
    });

    it('handles encoded message', async () => {
      const message = await cbor.encodeAsync(MOCK_PAYLOAD);
      const logger = { info: Utils.functional.noop, error: sinon.spy() };
      const handler = sinon.spy();
      const subscriber = { subscribe: sinon.spy(), on: sinon.spy() };
      const pubsub = new PubSub({ config: CONFIG, redis: {}, log: logger } as any);
      pubsub.subscriber.disconnect();
      pubsub.subscriber = subscriber as any;

      pubsub.subscribe(MOCK_CHANNEL, handler);
      await subscriber.on.args[0][1](Buffer.from(MOCK_CHANNEL), message);

      expect(logger.error).to.not.be.called;
      expect(handler).to.be.calledWithExactly(MOCK_PAYLOAD);
    });

    it('returns unsubscribe callback', () => {
      const logger = { info: Utils.functional.noop, error: Utils.functional.noop };
      const handler = sinon.spy();
      const subscriber = { subscribe: sinon.spy(), unsubscribe: sinon.spy(), on: sinon.spy(), off: sinon.spy() };
      const pubsub = new PubSub({ config: CONFIG, redis: {}, log: logger } as any);
      pubsub.subscriber.disconnect();
      pubsub.subscriber = subscriber as any;

      pubsub.subscribe(MOCK_CHANNEL, handler)();

      expect(subscriber.off).to.be.calledWithExactly('messageBuffer', sinon.match.func);
      expect(subscriber.unsubscribe).to.be.calledWithExactly(MOCK_CHANNEL);
    });
  });
});
