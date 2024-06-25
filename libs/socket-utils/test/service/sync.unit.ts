/* eslint-disable no-unused-expressions */
import { SyncService } from '@socket-utils/service/sync';
import { Utils } from '@voiceflow/common';
import { expect } from 'chai';
import sinon from 'sinon';

const MOCK_ACTION = Utils.protocol.createAction('mock_sync_service_action');
const MOCK_ACTION_CHANNEL = 'action_channel';
const MOCK_OPTIONS = {
  config: { LOGUX_ACTION_CHANNEL: MOCK_ACTION_CHANNEL },
};

describe('Service | Sync', () => {
  describe('start()', () => {
    const mockClients = () => ({
      pubsub: {
        subscribe: sinon.spy(),
        publish: sinon.spy(),
      },
    });
    const mockServer = () => ({
      nodeId: 'node_id',
      on: sinon.spy(),
      sendAction: sinon.spy(),
    });

    it('starts subscription to pubsub and event log', () => {
      const server = mockServer();
      const clients = mockClients();
      const options = {
        ...MOCK_OPTIONS,
        clients,
      };
      const sync = new SyncService(options as any);

      sync.start(server as any);

      expect(server.on).to.be.calledWithExactly('processed', sinon.match.func);
      expect(clients.pubsub.subscribe).to.be.calledWithExactly(MOCK_ACTION_CHANNEL, sinon.match.func);
    });

    it('publishes actions that originated from clients connected to own instance', () => {
      const server = mockServer();
      const clients = mockClients();
      const options = {
        ...MOCK_OPTIONS,
        clients,
      };
      const meta = { server: server.nodeId };
      const sync = new SyncService(options as any);

      sync.start(server as any);

      // invoke event log handler
      server.on.args[0][1](MOCK_ACTION, meta);

      expect(clients.pubsub.publish).to.be.calledWithExactly(MOCK_ACTION_CHANNEL, [MOCK_ACTION, meta]);
    });

    it('does not publish actions that originated from clients connected to other instances', () => {
      const server = mockServer();
      const clients = mockClients();
      const options = {
        ...MOCK_OPTIONS,
        clients,
      };
      const sync = new SyncService(options as any);

      sync.start(server as any);

      // invoke event log handler
      server.on.args[0][1](MOCK_ACTION, { server: 'other_node_id' });

      expect(clients.pubsub.publish).to.not.be.called;
    });

    it('broadcasts actions that originated from clients connected to other instances', () => {
      const server = mockServer();
      const clients = mockClients();
      const options = {
        ...MOCK_OPTIONS,
        clients,
      };
      const meta = { server: 'other_node_id' };
      const sync = new SyncService(options as any);

      sync.start(server as any);

      // invoke pubsub handler
      clients.pubsub.subscribe.args[0][1]([MOCK_ACTION, meta]);

      expect(server.sendAction).to.be.calledWithExactly(MOCK_ACTION, meta);
    });

    it('does not broadcast actions that originated from clients connected to this instance', () => {
      const server = mockServer();
      const clients = mockClients();
      const options = {
        ...MOCK_OPTIONS,
        clients,
      };
      const sync = new SyncService(options as any);

      sync.start(server as any);

      // invoke pubsub handler
      clients.pubsub.subscribe.args[0][1]([MOCK_ACTION, { server: server.nodeId }]);

      expect(server.sendAction).to.not.be.called;
    });
  });
});
