/* eslint-disable promise/valid-params, max-classes-per-file */
import { AbstractActionControl } from '@socket-utils/control/action';
import { Utils } from '@voiceflow/common';
import { expect } from 'chai';
import sinon from 'sinon';

import { mockAxiosError } from '../_fixtures';

const mockActionCreator = Utils.protocol.createAction('action.MOCK_ACTION');

const MOCK_ACTION = mockActionCreator();
const MOCK_CONTEXT = { is: 'context', data: { creatorID: 123 } };
const MOCK_META = { is: 'meta' };

class MockActionControl extends AbstractActionControl<any, any> {
  actionCreator = mockActionCreator;

  access = sinon.stub();

  process = sinon.stub();

  beforeAccess = sinon.stub();

  beforeProcess = sinon.stub();

  handleExpiredAuth = sinon.spy();
}

describe('Control | Action', () => {
  const mockServer = () => ({
    type: sinon.spy(),
    logger: { error: sinon.spy() },
  });

  describe('access()', () => {
    it('checks action access', async () => {
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.access.resolves(true);

      action.setup();
      await expect(server.type.args[0][1].access(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).to.eventually.be.true;

      expect(action.access).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.beforeAccess).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
    });

    it('forwards unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.access.rejects(error);

      action.setup();
      await expect(server.type.args[0][1].access(MOCK_CONTEXT)).to.be.rejectedWith(error);
    });

    it('silently handles unauthorized error', async () => {
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.access.rejects(mockAxiosError(401));

      action.setup();
      await expect(server.type.args[0][1].access(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).to.eventually.be.false;

      expect(action.access).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.handleExpiredAuth).to.be.calledWithExactly(MOCK_CONTEXT);
    });
  });

  describe('process()', () => {
    it('processes an action', async () => {
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.process.resolves();

      action.setup();
      await server.type.args[0][1].process(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);

      expect(action.process).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.beforeProcess).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
    });

    it('forwards unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.process.rejects(error);

      action.setup();
      await expect(server.type.args[0][1].process(MOCK_CONTEXT)).to.be.rejectedWith(error);
    });

    it('forwards unauthorized error', async () => {
      const error = mockAxiosError(401);
      const server = mockServer();
      const options = { server };
      const action = new MockActionControl(options as any);
      action.process.rejects(error);

      action.setup();
      await expect(server.type.args[0][1].process(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).to.be.rejectedWith(error);

      expect(action.process).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.handleExpiredAuth).to.be.calledWithExactly(MOCK_CONTEXT);
    });
  });

  describe('finally()', () => {
    class MockFinallyAction extends MockActionControl {
      finally = sinon.stub();
    }

    it('executes finalizing operations', async () => {
      const server = mockServer();
      const options = { server };
      const action = new MockFinallyAction(options as any);
      action.finally.resolves();

      action.setup();
      await server.type.args[0][1].finally(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);

      expect(action.finally).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
    });

    it('silently handles unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const action = new MockFinallyAction(options as any);
      action.finally.rejects(error);

      action.setup();
      await server.type.args[0][1].finally(MOCK_CONTEXT);

      expect(server.logger.error).to.be.calledWithExactly(
        "encountered error in 'finally' handler of action 'action.MOCK_ACTION'"
      );
    });

    it('silently handles unauthorized error', async () => {
      const error = mockAxiosError(401);
      const server = mockServer();
      const options = { server };
      const action = new MockFinallyAction(options as any);
      action.finally.rejects(error);

      action.setup();
      await server.type.args[0][1].finally(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);

      expect(action.finally).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.handleExpiredAuth).to.be.calledWithExactly(MOCK_CONTEXT);
    });
  });

  describe('resend()', () => {
    class MockResendAction extends MockActionControl {
      resend = sinon.stub();
    }

    it('extracts resend targets', async () => {
      const resendTargets = { channel: 'channel/123' };
      const server = mockServer();
      const options = { server };
      const action = new MockResendAction(options as any);
      action.resend.resolves(resendTargets);

      action.setup();
      await expect(server.type.args[0][1].resend(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).to.eventually.eq(resendTargets);

      expect(action.resend).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
    });

    it('silently handles unexpected error', async () => {
      const error = new Error();
      const server = mockServer();
      const options = { server };
      const action = new MockResendAction(options as any);
      action.resend.rejects(error);

      action.setup();
      await expect(server.type.args[0][1].resend(MOCK_CONTEXT)).to.eventually.eql({});

      expect(server.logger.error).to.be.calledWithExactly(
        "encountered error in 'resend' handler of action 'action.MOCK_ACTION'"
      );
    });

    it('silently handles unauthorized error', async () => {
      const error = mockAxiosError(401);
      const server = mockServer();
      const options = { server };
      const action = new MockResendAction(options as any);
      action.resend.rejects(error);

      action.setup();
      await expect(server.type.args[0][1].resend(MOCK_CONTEXT, MOCK_ACTION, MOCK_META)).to.eventually.eql({});

      expect(action.resend).to.be.calledWithExactly(MOCK_CONTEXT, MOCK_ACTION, MOCK_META);
      expect(action.handleExpiredAuth).to.be.calledWithExactly(MOCK_CONTEXT);
    });
  });
});
