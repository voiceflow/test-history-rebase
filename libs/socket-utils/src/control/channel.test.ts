/* eslint-disable promise/valid-params, max-classes-per-file */
import { Utils } from '@voiceflow/common';
import { describe, expect, it, vi } from 'vitest';

import { mockAxiosError } from './_fixtures';
import { AbstractChannelControl } from './channel';

const MOCK_ACTION = Utils.protocol.createAction('channel.MOCK_ACTION')();
const MOCK_CONTEXT = { is: 'context' };
const MOCK_ACTION_CHANNEL = Utils.protocol.createChannel(['channelID'], ({ channelID }) => `channel/${channelID}`);

class MockChannelControl extends AbstractChannelControl<any, any> {
  channel = MOCK_ACTION_CHANNEL;

  access = vi.fn();

  handleExpiredAuth = vi.fn();
}

describe('Control | Channel', () => {
  const mockServer = () => ({
    channel: vi.fn(),
    logger: { error: vi.fn() },
  });

  describe('access()', () => {
    it('checks channel access', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockChannelControl(options as any);
      channel.access.mockResolvedValue(true);

      channel.setup();
      await expect(server.channel.mock.calls[0][1].access(MOCK_CONTEXT)).resolves.toBe(true);

      expect(channel.access).toBeCalledWith(MOCK_CONTEXT);
    });

    it('forwards unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const channel = new MockChannelControl(options as any);
      channel.access.mockRejectedValue(error);

      channel.setup();
      await expect(server.channel.mock.calls[0][1].access()).rejects.toThrow(error);
    });

    it('silently handles unauthorized error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockChannelControl(options as any);
      channel.access.mockRejectedValue(mockAxiosError(401));

      channel.setup();
      await expect(server.channel.mock.calls[0][1].access(MOCK_CONTEXT)).resolves.toBe(false);

      expect(channel.access).toBeCalledWith(MOCK_CONTEXT);
      expect(channel.handleExpiredAuth).toBeCalledWith(MOCK_CONTEXT);
    });
  });

  describe('load()', () => {
    class MockLoadChannel extends MockChannelControl {
      load = vi.fn();
    }

    it('loads channel resources', async () => {
      const resources = [Utils.protocol.createAction('LOAD_RESOURCE')()];
      const server = mockServer();
      const options = { server };
      const channel = new MockLoadChannel(options as any);
      channel.load.mockResolvedValue(resources);

      channel.setup();
      await expect(server.channel.mock.calls[0][1].load(MOCK_CONTEXT, MOCK_ACTION)).resolves.toBe(resources);

      expect(channel.load).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION);
    });

    it('forwards unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const channel = new MockLoadChannel(options as any);
      channel.load.mockRejectedValue(error);

      channel.setup();
      await expect(server.channel.mock.calls[0][1].load()).rejects.toThrowError(error);
    });

    it('forwards unauthorized error', async () => {
      const error = mockAxiosError(401);
      const server = mockServer();
      const options = { server };
      const channel = new MockLoadChannel(options as any);
      channel.load.mockRejectedValue(error);

      channel.setup();
      await expect(server.channel.mock.calls[0][1].load(MOCK_CONTEXT, MOCK_ACTION)).rejects.toThrow(error);

      expect(channel.load).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION);
      expect(channel.handleExpiredAuth).toBeCalledWith(MOCK_CONTEXT);
    });
  });

  describe('finally()', () => {
    class MockFinallyChannel extends MockChannelControl {
      finally = vi.fn();
    }

    it('executes finalizing operations', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockFinallyChannel(options as any);

      channel.setup();
      await server.channel.mock.calls[0][1].finally(MOCK_CONTEXT, MOCK_ACTION);

      expect(channel.finally).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION);
    });

    it('catches error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockFinallyChannel(options as any);
      channel.finally.mockRejectedValue(new Error());

      channel.setup();
      await server.channel.mock.calls[0][1].finally();

      expect(server.logger.error).toBeCalledWith(
        "encountered error in 'finally' handler of channel 'channel/:channelID'"
      );
    });

    it('catches unauthorized error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockFinallyChannel(options as any);
      channel.finally.mockRejectedValue(mockAxiosError(401));

      channel.setup();
      await server.channel.mock.calls[0][1].finally(MOCK_CONTEXT, MOCK_ACTION);

      expect(channel.finally).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION);
      expect(channel.handleExpiredAuth).toBeCalledWith(MOCK_CONTEXT);
    });
  });

  describe('unsubscribe()', () => {
    class MockUnsubscribeChannel extends MockChannelControl {
      unsubscribe = vi.fn();
    }

    it('executes unsubscribe operations', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockUnsubscribeChannel(options as any);

      channel.setup();
      await server.channel.mock.calls[0][1].unsubscribe(MOCK_CONTEXT, MOCK_ACTION);

      expect(channel.unsubscribe).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION);
    });

    it('catches error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockUnsubscribeChannel(options as any);
      channel.unsubscribe.mockRejectedValue(new Error());

      channel.setup();
      await server.channel.mock.calls[0][1].unsubscribe();

      expect(server.logger.error).toBeCalledWith(
        "encountered error in 'unsubscribe' handler of channel 'channel/:channelID'"
      );
    });

    it('catches unauthorized error', async () => {
      const server = mockServer();
      const options = { server };
      const channel = new MockUnsubscribeChannel(options as any);
      channel.unsubscribe.mockRejectedValue(mockAxiosError(401));

      channel.setup();
      await server.channel.mock.calls[0][1].unsubscribe(MOCK_CONTEXT, MOCK_ACTION);

      expect(channel.unsubscribe).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION);
      expect(channel.handleExpiredAuth).toBeCalledWith(MOCK_CONTEXT);
    });
  });
});
