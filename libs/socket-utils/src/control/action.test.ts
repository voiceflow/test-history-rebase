/* eslint-disable promise/valid-params, max-classes-per-file */
import { Utils } from '@voiceflow/common';
import { describe, expect, it, vi } from 'vitest';

import { mockAxiosError } from './_fixtures';
import { AbstractActionControl } from './action';

const mockActionCreator = Utils.protocol.createAction('action.MOCK_ACTION');

const MOCK_ACTION = mockActionCreator();
const MOCK_CONTEXT = { is: 'context', data: { creatorID: 123 } };
const MOCK_META = { is: 'meta' };

class MockActionControl extends AbstractActionControl<any, any> {
  actionCreator = mockActionCreator;

  access = vi.fn();

  process = vi.fn();

  beforeAccess = vi.fn();

  beforeProcess = vi.fn();

  handleExpiredAuth = vi.fn();
}

describe('Control | Action', () => {
  const mockServer = () => ({
    type: vi.fn(),
    logger: { error: vi.fn() },
  });

  describe('access()', () => {
    it('checks action access', async () => {
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.access.mockResolvedValue(true);

      action.setup();
      await expect(server.type.mock.calls[0][1].access(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).resolves.toBe(true);

      expect(action.access).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.beforeAccess).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
    });

    it('forwards unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.access.mockRejectedValue(error);

      action.setup();
      await expect(server.type.mock.calls[0][1].access(MOCK_CONTEXT)).rejects.toThrow(error);
    });

    it('silently handles unauthorized error', async () => {
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.access.mockRejectedValue(mockAxiosError(401));

      action.setup();
      await expect(server.type.mock.calls[0][1].access(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).resolves.toBe(false);

      expect(action.access).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.handleExpiredAuth).toBeCalledWith(MOCK_CONTEXT);
    });
  });

  describe('process()', () => {
    it('processes an action', async () => {
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.process.mockResolvedValue(undefined);

      action.setup();
      await server.type.mock.calls[0][1].process(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);

      expect(action.process).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.beforeProcess).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
    });

    it('forwards unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.process.mockRejectedValue(error);

      action.setup();
      await expect(server.type.mock.calls[0][1].process(MOCK_CONTEXT)).rejects.toThrow(error);
    });

    it('forwards unauthorized error', async () => {
      const error = mockAxiosError(401);
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.process.mockRejectedValue(error);

      action.setup();
      await expect(server.type.mock.calls[0][1].process(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).rejects.toThrow(error);

      expect(action.process).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.handleExpiredAuth).toBeCalledWith(MOCK_CONTEXT);
    });
  });

  describe('finally()', () => {
    class MockFinallyAction extends MockActionControl {
      finally = vi.fn();
    }

    it('executes finalizing operations', async () => {
      const server = mockServer();
      const options = { server };
      const action = new MockFinallyAction(options as any);
      action.finally.mockResolvedValue(undefined);

      action.setup();
      await server.type.mock.calls[0][1].finally(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);

      expect(action.finally).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
    });

    it('silently handles unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const action = new MockFinallyAction(options as any);
      action.finally.mockRejectedValue(error);

      action.setup();
      await server.type.mock.calls[0][1].finally(MOCK_CONTEXT);

      expect(server.logger.error).toBeCalledWith(
        "encountered error in 'finally' handler of action 'action.MOCK_ACTION'"
      );
    });

    it('silently handles unauthorized error', async () => {
      const error = mockAxiosError(401);
      const server = mockServer();
      const options = { server };
      const action = new MockFinallyAction(options as any);
      action.finally.mockRejectedValue(error);

      action.setup();
      await server.type.mock.calls[0][1].finally(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);

      expect(action.finally).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.handleExpiredAuth).toBeCalledWith(MOCK_CONTEXT);
    });
  });

  describe('resend()', () => {
    class MockResendAction extends MockActionControl {
      resend = vi.fn();
    }

    it('extracts resend targets', async () => {
      const resendTargets = { channel: 'channel/123' };
      const server = mockServer();
      const options = { server };
      const action = new MockResendAction(options as any);
      action.resend.mockResolvedValue(resendTargets);

      action.setup();
      await expect(server.type.mock.calls[0][1].resend(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).resolves.toBe(
        resendTargets
      );

      expect(action.resend).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
    });

    it('silently handles unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const action = new MockResendAction(options as any);
      action.resend.mockRejectedValue(error);

      action.setup();
      await expect(server.type.mock.calls[0][1].resend(MOCK_CONTEXT)).resolves.toEqual({});

      expect(server.logger.error).toBeCalledWith(
        "encountered error in 'resend' handler of action 'action.MOCK_ACTION'"
      );
    });

    it('silently handles unauthorized error', async () => {
      const error = mockAxiosError(401);
      const server = mockServer();
      const options = { server };
      const action = new MockResendAction(options as any);
      action.resend.mockRejectedValue(error);

      action.setup();
      await expect(server.type.mock.calls[0][1].resend(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).resolves.toEqual({});

      expect(action.resend).toBeCalledWith(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.handleExpiredAuth).toBeCalledWith(MOCK_CONTEXT);
    });
  });
});
