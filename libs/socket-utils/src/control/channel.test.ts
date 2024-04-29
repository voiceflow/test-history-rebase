/* eslint-disable promise/valid-params, max-classes-per-file */
import { Utils } from '@voiceflow/common';

import { mockAxiosError } from './_fixtures';
import { AbstractChannelControl } from './channel';

const MOCK_ACTION = Utils.protocol.createAction('channel.MOCK_ACTION')();
const MOCK_CONTEXT = { is: 'context' };
const MOCK_ACTION_CHANNEL = Utils.protocol.createChannel(['channelID'], ({ channelID }) => `channel/${channelID}`);

class MockChannelControl extends AbstractChannelControl<any, any> {
  channel = MOCK_ACTION_CHANNEL;

  access = sinon.stub();

  handleExpiredAuth = sinon.spy();
}

describe('Control | Channel', () => {
  const mockServer = () => ({
    channel: sinon.spy(),
    logger: { error: sinon.spy() },
  });

  describe('access()', () => {
    it('checks channel access', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockChannelControl(options as any);
      channel.access.resolves(true);

      channel.setup();
      await expect(server.channel.args[0][1].access(MOCK_CONTEXT)).to.eventually.be.true;

      expect(channel.access).to.be.calledWithExactly(MOCK_CONTEXT);
    });

    it('forwards unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const channel = new MockChannelControl(options as any);
      channel.access.rejects(error);

      channel.setup();
      await expect(server.channel.args[0][1].access()).to.be.rejectedWith(error);
    });

    it('silently handles unauthorized error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockChannelControl(options as any);
      channel.access.rejects(mockAxiosError(401));

      channel.setup();
      await expect(server.channel.args[0][1].access(MOCK_CONTEXT)).to.eventually.be.false;

      expect(channel.access).to.be.calledWithExactly(MOCK_CONTEXT);
      expect(channel.handleExpiredAuth).to.be.calledWithExactly(MOCK_CONTEXT);
    });
  });

  describe('load()', () => {
    class MockLoadChannel extends MockChannelControl {
      load = sinon.stub();
    }

    it('loads channel resources', async () => {
      const resources = [Utils.protocol.createAction('LOAD_RESOURCE')()];
      const server = mockServer();
      const options = { server };
      const channel = new MockLoadChannel(options as any);
      channel.load.resolves(resources);

      channel.setup();
      await expect(server.channel.args[0][1].load(MOCK_CONTEXT, MOCK_ACTION)).to.eventually.eq(resources);

      expect(channel.load).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION);
    });

    it('forwards unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const channel = new MockLoadChannel(options as any);
      channel.load.rejects(error);

      channel.setup();
      await expect(server.channel.args[0][1].load()).to.be.rejectedWith(error);
    });

    it('forwards unauthorized error', async () => {
      const error = mockAxiosError(401);
      const server = mockServer();
      const options = { server };
      const channel = new MockLoadChannel(options as any);
      channel.load.rejects(error);

      channel.setup();
      await expect(server.channel.args[0][1].load(MOCK_CONTEXT, MOCK_ACTION)).to.be.rejectedWith(error);

      expect(channel.load).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION);
      expect(channel.handleExpiredAuth).to.be.calledWithExactly(MOCK_CONTEXT);
    });
  });

  describe('finally()', () => {
    class MockFinallyChannel extends MockChannelControl {
      finally = sinon.stub();
    }

    it('executes finalizing operations', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockFinallyChannel(options as any);

      channel.setup();
      await server.channel.args[0][1].finally(MOCK_CONTEXT, MOCK_ACTION);

      expect(channel.finally).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION);
    });

    it('catches error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockFinallyChannel(options as any);
      channel.finally.rejects(new Error());

      channel.setup();
      await server.channel.args[0][1].finally();

      expect(server.logger.error).to.be.calledWithExactly(
        "encountered error in 'finally' handler of channel 'channel/:channelID'"
      );
    });

    it('catches unauthorized error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockFinallyChannel(options as any);
      channel.finally.rejects(mockAxiosError(401));

      channel.setup();
      await server.channel.args[0][1].finally(MOCK_CONTEXT, MOCK_ACTION);

      expect(channel.finally).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION);
      expect(channel.handleExpiredAuth).to.be.calledWithExactly(MOCK_CONTEXT);
    });
  });

  describe('unsubscribe()', () => {
    class MockUnsubscribeChannel extends MockChannelControl {
      unsubscribe = sinon.stub();
    }

    it('executes unsubscribe operations', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockUnsubscribeChannel(options as any);

      channel.setup();
      await server.channel.args[0][1].unsubscribe(MOCK_CONTEXT, MOCK_ACTION);

      expect(channel.unsubscribe).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION);
    });

    it('catches error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockUnsubscribeChannel(options as any);
      channel.unsubscribe.rejects(new Error());

      channel.setup();
      await server.channel.args[0][1].unsubscribe();

      expect(server.logger.error).to.be.calledWithExactly(
        "encountered error in 'unsubscribe' handler of channel 'channel/:channelID'"
      );
    });

    it('catches unauthorized error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockUnsubscribeChannel(options as any);
      channel.unsubscribe.rejects(mockAxiosError(401));

      channel.setup();
      await server.channel.args[0][1].unsubscribe(MOCK_CONTEXT, MOCK_ACTION);

      expect(channel.unsubscribe).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION);
      expect(channel.handleExpiredAuth).to.be.calledWithExactly(MOCK_CONTEXT);
    });
  });
});
