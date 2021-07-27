/* eslint-disable @typescript-eslint/ban-types */
import type { LoguxSubscribeAction, LoguxUnsubscribeAction } from '@logux/actions';
import { ChannelContext as BaseChannelContext, SendBackActions } from '@logux/server';

import { AbstractLoguxControl } from '../control';

export type ChannelContext<P extends object, D extends object = {}> = BaseChannelContext<D, P, {}>;

export abstract class AbstractChannelControl<P extends object, D extends object = {}> extends AbstractLoguxControl {
  protected abstract channel: string;

  protected abstract access: (ctx: ChannelContext<P, D>) => Promise<boolean>;

  protected load?: (ctx: ChannelContext<P, D>, action: LoguxSubscribeAction) => SendBackActions | Promise<SendBackActions>;

  protected finally?: (ctx: ChannelContext<P, D>, action: LoguxSubscribeAction) => void;

  protected unsubscribe?: (ctx: ChannelContext<P, D>, action: LoguxUnsubscribeAction) => void;

  setup(): void {
    this.server.channel<P, D>(this.channel, {
      load: this.load,
      access: this.access,
      finally: this.finally,
      unsubscribe: this.unsubscribe,
    });
  }
}
