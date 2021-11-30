import { Client } from '@logux/client';
import { logger } from '@voiceflow/ui';

export const clientLogger = logger.child('client');

export class LoguxClient extends Client {
  private pinging?: NodeJS.Timeout;

  private subscriptions!: Record<string, number>;

  async logout(): Promise<void> {
    const { subscriptions } = this;

    this.subscriptions = {};

    // remove all active subscriptions
    await Promise.all(
      Object.keys(subscriptions).map(async (subscribeJSON) => {
        try {
          const { channel } = JSON.parse(subscribeJSON) as { channel: string };

          await this.sync({ channel, type: 'logux/unsubscribe' });
        } catch {
          // fail silently on invalid subscription entry
        }
      })
    );

    // clean the log store
    await this.log.store?.clean();

    // destroy websocket connection
    this.node.connection.disconnect('destroy');

    // remove the server ping interval
    if (this.pinging) {
      clearInterval(this.pinging);
    }
  }
}
