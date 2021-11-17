/* eslint-disable @typescript-eslint/ban-types */
import type { LoguxSubscribeAction, LoguxUnsubscribeAction } from '@logux/actions';
import { SendBackActions } from '@logux/server';
import { ChannelContext } from '@socket-utils/types';
import { Eventual, Utils } from '@voiceflow/common';

import { AbstractLoguxControl, LoguxControlOptions } from './utils';

// eslint-disable-next-line import/prefer-default-export
export abstract class AbstractChannelControl<T extends LoguxControlOptions, P extends object, D extends object = {}> extends AbstractLoguxControl<T> {
  protected abstract channel: Utils.protocol.Channel<Extract<keyof P, string>>;

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
