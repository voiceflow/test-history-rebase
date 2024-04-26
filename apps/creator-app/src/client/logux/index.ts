import { Client } from '@logux/client';
import type { ClientActionListener } from '@logux/client/client';
import type { Action as LoguxAction, LoguxError } from '@logux/core';
import type { Unsubscribe } from 'nanoevents';
import { createNanoEvents } from 'nanoevents';
import type { Action, ActionCreator } from 'typescript-fsa';

import { clientLogger } from '@/client/utils';

import { CLIENT_EVENTS, ClientEvents, ConnectionStatus } from './constants';

export * from './constants';

class LoguxClient extends Client {
  connectionStatus = ConnectionStatus.IDLE;

  private pinging?: NodeJS.Timeout;

  private clientEmitter = createNanoEvents<Record<ConnectionStatus | ClientEvents, VoidFunction>>();

  private stateChangeListener = (): void => {
    switch (this.connectionStatus) {
      case ConnectionStatus.CONNECTED:
        if (!this.connected) {
          this.setConnectionStatus(ConnectionStatus.RECONNECTING);
        }

        break;

      case ConnectionStatus.IDLE:
      case ConnectionStatus.RECONNECTING:
        if (this.state === 'synchronized') {
          this.setConnectionStatus(ConnectionStatus.CONNECTED);
        }

        break;

      default:
    }
  };

  private errorListener = (err: LoguxError) => {
    if (err.type === 'wrong-credentials') {
      this.clientEmitter.emit(ClientEvents.WRONG_CREDENTIALS);
    }

    clientLogger.error(err);
  };

  private setConnectionStatus(status: ConnectionStatus) {
    this.connectionStatus = status;
    this.clientEmitter.emit(status);
  }

  isSynced() {
    return this.connected && this.state === 'synchronized';
  }

  start(): VoidFunction {
    const teardownStateChangeListener = this.on('state', this.stateChangeListener);
    const teardownErrorListener = this.node.catch(this.errorListener);

    super.start();

    return () => {
      teardownStateChangeListener();
      teardownErrorListener();
    };
  }

  /* eslint-disable lines-between-class-members */
  on(event: 'state', listener: () => void): Unsubscribe;
  on(event: 'preadd' | 'add' | 'clean', listener: ClientActionListener<LoguxAction>): Unsubscribe;
  on(event: 'user', listener: (userId: string) => void): Unsubscribe;
  on(event: ConnectionStatus, listener: VoidFunction): Unsubscribe;
  on(event: ClientEvents, listener: VoidFunction): Unsubscribe;
  on(event: string, listener: (...args: any[]) => void): Unsubscribe {
    if (CLIENT_EVENTS.includes(event)) {
      return this.clientEmitter.on(event as ConnectionStatus | ClientEvents, listener);
    }

    return super.on(event as any, listener);
  }
  /* eslint-enable lines-between-class-members */

  onAction<P>(actionCreator: ActionCreator<P>, listener: (action: Action<P>) => void): VoidFunction {
    return this.type(actionCreator.type, listener);
  }

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

export default LoguxClient;
