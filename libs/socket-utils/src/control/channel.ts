/* eslint-disable @typescript-eslint/ban-types */
import type { LoguxUnsubscribeAction } from '@logux/actions';
import { SendBackActions } from '@logux/server';
import { ChannelContext, ChannelSubscribeAction } from '@socket-utils/types';
import { Eventual, Utils } from '@voiceflow/common';

import { AbstractLoguxControl, isUnauthorizedError, LoguxControlOptions } from './utils';

export abstract class AbstractChannelControl<
  T extends LoguxControlOptions,
  P extends object,
  E extends object = {},
  D extends object = {}
> extends AbstractLoguxControl<T> {
  protected abstract channel: Utils.protocol.Channel<Extract<keyof P, string>>;

  protected abstract access: (ctx: ChannelContext<P, D>) => Eventual<boolean>;

  protected load?: (ctx: ChannelContext<P, D>, action: ChannelSubscribeAction<E>) => Eventual<SendBackActions>;

  protected finally?: (ctx: ChannelContext<P, D>, action: ChannelSubscribeAction<E>) => Eventual<void>;

  protected unsubscribe?: (ctx: ChannelContext<P, D>, action: LoguxUnsubscribeAction) => Eventual<void>;

  protected handleExpiredAuth?: (ctx: ChannelContext<P, D>) => Eventual<void>;

  private logError(stage: string) {
    this.server.logger.error(`encountered error in '${stage}' handler of channel '${this.channel.buildMatcher()}'`);
  }

  #load: AbstractChannelControl<T, P, E, D>['load'] = async (ctx, action) => {
    try {
      return await this.load?.(ctx, action);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await this.handleExpiredAuth?.(ctx);
      }

      throw err;
    }
  };

  #access: AbstractChannelControl<T, P, E, D>['access'] = async (ctx) => {
    try {
      return await this.access?.(ctx);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await this.handleExpiredAuth?.(ctx);

        return false;
      }

      throw err;
    }
  };

  #finally: AbstractChannelControl<T, P, E, D>['finally'] = async (ctx, action) => {
    try {
      // eslint-disable-next-line promise/valid-params
      await this.finally?.(ctx, action);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await this.handleExpiredAuth?.(ctx);
      } else {
        this.logError('finally');
      }
    }
  };

  #unsubscribe: AbstractChannelControl<T, P, E, D>['unsubscribe'] = async (ctx, action) => {
    try {
      await this.unsubscribe?.(ctx, action);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        await this.handleExpiredAuth?.(ctx);
      } else {
        this.logError('unsubscribe');
      }
    }
  };

  protected setupChannel(channel: string) {
    this.server.channel<P, D, ChannelSubscribeAction<E>>(channel, {
      load: this.#load,
      access: this.#access,
      finally: this.#finally,
      unsubscribe: this.#unsubscribe,
    });
  }

  setup(): void {
    this.setupChannel(this.channel.buildMatcher());
  }
}
