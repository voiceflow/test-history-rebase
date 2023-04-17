import { Server, ServerMeta } from '@logux/server';
import { AbstractControl, ControlOptions } from '@socket-utils/control';
import { Utils } from '@voiceflow/common';
import { AnyAction } from 'typescript-fsa';

export interface SyncServiceConfig {
  LOGUX_ACTION_CHANNEL: string;
}

export class SyncService extends AbstractControl<ControlOptions<SyncServiceConfig>> {
  // FIXME: needed to explicitly add this constructor for it to be reusable for some reason
  // without it other projects think it doesn't take any arguments
  constructor(options: ControlOptions<SyncServiceConfig>) {
    super(options);
  }

  private unsubscribe: () => void = Utils.functional.noop;

  public start(server: Server): void {
    // listen to messages on the "realtime:actions" channels and re-broadcast them to connected clients
    const pubsubUnsubscribe = this.clients.pubsub.subscribe<[AnyAction, ServerMeta]>(this.config.LOGUX_ACTION_CHANNEL, ([action, meta]) => {
      // only broadcast actions that originated from clients not connected to this instance of the service
      if (meta.server === server.nodeId) return;

      server.sendAction(action, meta);
    });

    // listen to actions from this server's event log and publish them to the "realtime:actions" channel
    const actionsUnsubscribe = server.on('processed', async (action, meta) => {
      // only publish actions that originated from clients connected to this instance of the service
      if (meta.server !== server.nodeId) return;

      await this.clients.pubsub.publish(this.config.LOGUX_ACTION_CHANNEL, [action, meta]);
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
