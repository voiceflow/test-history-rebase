/* eslint-disable @typescript-eslint/ban-types */
import type { LoguxSubscribeAction, LoguxUnsubscribeAction } from '@logux/actions';
import { ChannelContext as BaseChannelContext, SendBackActions } from '@logux/server';
import { Eventual } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractLoguxControl } from '../control';

export type ChannelContext<P extends object, D extends object = {}> = BaseChannelContext<D, P, {}>;

export type ChannelAccessor<P extends object, D extends object = {}> = (ctx: ChannelContext<P, D>) => Eventual<boolean>;

export abstract class AbstractChannelControl<P extends object, D extends object = {}> extends AbstractLoguxControl {
  protected abstract channel: Realtime.Channels.Channel<Extract<keyof P, string>>;

  protected abstract access: (ctx: ChannelContext<P, D>) => Eventual<boolean>;

  protected load?: (ctx: ChannelContext<P, D>, action: LoguxSubscribeAction) => Eventual<SendBackActions>;

  protected finally?: (ctx: ChannelContext<P, D>, action: LoguxSubscribeAction) => void;

  protected unsubscribe?: (ctx: ChannelContext<P, D>, action: LoguxUnsubscribeAction) => void;

  setup(): void {
    this.server.channel<P, D>(this.channel.buildMatcher(), {
      load: this.load,
      access: this.access,
      finally: this.finally,
      unsubscribe: this.unsubscribe,
    });
  }
}
