import { Utils } from '@voiceflow/common';
import { describe, expect, it, vi } from 'vitest';

import { SyncService } from './sync';

const MOCK_ACTION = Utils.protocol.createAction('mock_sync_service_action');
const MOCK_ACTION_CHANNEL = 'action_channel';
const MOCK_OPTIONS = {
  config: { LOGUX_ACTION_CHANNEL: MOCK_ACTION_CHANNEL },
};

describe('Service | Sync', () => {
  describe('start()', () => {
    const mockClients = () => ({
      pubsub: {
        subscribe: vi.fn(),
        publish: vi.fn(),
      },
    });
    const mockServer = () => ({
      nodeId: 'node_id',
      on: vi.fn(),
      sendAction: vi.fn(),
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

      expect(server.on).toBeCalledWith('processed', expect.any(Function));
      expect(clients.pubsub.subscribe).toBeCalledWith(MOCK_ACTION_CHANNEL, expect.any(Function));
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
      server.on.mock.calls[0][1](MOCK_ACTION, meta);

      expect(clients.pubsub.publish).toBeCalledWith(MOCK_ACTION_CHANNEL, [MOCK_ACTION, meta]);
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
      server.on.mock.calls[0][1](MOCK_ACTION, { server: 'other_node_id' });

      expect(clients.pubsub.publish).not.toBeCalled();
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
      clients.pubsub.subscribe.mock.calls[0][1]([MOCK_ACTION, meta]);

      expect(server.sendAction).toBeCalledWith(MOCK_ACTION, meta);
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
      clients.pubsub.subscribe.mock.calls[0][1]([MOCK_ACTION, { server: server.nodeId }]);

      expect(server.sendAction).not.toBeCalled();
    });
  });
});
