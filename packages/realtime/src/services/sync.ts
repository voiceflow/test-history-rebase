import { Server, ServerMeta } from '@logux/server';
import { Utils } from '@voiceflow/common';
import { AnyAction } from 'typescript-fsa';

import { AbstractControl } from '@/control';

const CHANNEL = 'realtime:actions';

class SyncService extends AbstractControl {
  private unsubscribe: () => void = Utils.functional.noop;

  public start(server: Server): void {
    // listen to messages on the "realtime:actions" channels and re-broadcast them to connected clients
    const pubsubUnsubscribe = this.clients.pubsub.subscribe<[AnyAction, ServerMeta]>(CHANNEL, ([action, meta]) => {
      // only broadcast actions that originated from clients not connected to this instance of the service
      if (meta.server === server.nodeId) return;

      server.sendAction(action, meta);
    });

    // listen to actions from this server's event log and publish them to the "realtime:actions" channel
    const actionsUnsubscribe = server.on('processed', (action, meta) => {
      // only publish actions that originated from clients connected to this instance of the service
      if (meta.server !== server.nodeId) return;

      this.clients.pubsub.publish(CHANNEL, [action, meta]);
    });

    this.unsubscribe = () => {
      pubsubUnsubscribe();
      actionsUnsubscribe();
    };
  }

  public stop(): void {
    this.unsubscribe();

    this.unsubscribe = Utils.functional.noop;
  }
}

export default SyncService;
