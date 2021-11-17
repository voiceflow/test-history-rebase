/* eslint-disable max-classes-per-file */
import type { ServerMeta } from '@logux/server';
import { ActionAccessor, BaseContextData, Context, Resender } from '@socket-utils/types';
import { Eventual, Utils } from '@voiceflow/common';
import type { Action, ActionCreator, AsyncActionCreators } from 'typescript-fsa';

import { AbstractLoguxControl, LoguxControlOptions } from './utils';

export abstract class AbstractActionControl<
  T extends LoguxControlOptions,
  P,
  D extends BaseContextData = BaseContextData
> extends AbstractLoguxControl<T> {
  private static extractCreatorID<D extends BaseContextData>(ctx: Context<D>, action: Action<unknown>) {
    if (ctx.data.creatorID) return;

    const creatorID = ctx.isServer ? action.meta?.creatorID : ctx.userId;
    ctx.data.creatorID = Number(creatorID);
  }

  protected abstract actionCreator: ActionCreator<P>;

  protected abstract access: ActionAccessor<P, D>;

  protected abstract process: (ctx: Context<D>, action: Action<P>, meta: ServerMeta) => Eventual<void>;

  protected resend: Resender<P, D> | undefined = undefined;

  protected finally: ((ctx: Context<D>, action: Action<P>, meta: ServerMeta) => void) | undefined = undefined;

  protected dataFactory?: () => D;

  // eslint-disable-next-line class-methods-use-this
  protected reply<R, E = void>(
    actionCreators: AsyncActionCreators<P, R, E>,
    process: (ctx: Context<D>, action: Action<P>, meta: ServerMeta) => Promise<R>
  ): (ctx: Context<D>, action: Action<P>, meta: ServerMeta) => Promise<void> {
    return async (ctx, action, meta) => {
      try {
        const result = await process(ctx, action, meta);

        await ctx.sendBack(actionCreators.done({ params: action.payload, result }, { actionID: action.meta?.actionID }));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'unhandled error';

        await ctx.sendBack(
          actionCreators.failed({ params: action.payload, error: { message: errorMessage } as any }, { actionID: action.meta?.actionID })
        );
      }
    };
  }

  // eslint-disable-next-line class-methods-use-this
  protected beforeAccess(_ctx: Context<D>, _action: Action<P>, _meta: ServerMeta) {
    // noop
  }

  // eslint-disable-next-line class-methods-use-this
  protected beforeProcess(_ctx: Context<D>, _action: Action<P>, _meta: ServerMeta) {
    // noop
  }

  /**
   * wraps the access hook to add an optional initializer for the context data
   */
  #access: AbstractActionControl<T, P, D>['access'] = (ctx, action, meta) => {
    AbstractActionControl.extractCreatorID(ctx, action);
    this.beforeAccess(ctx, action, meta);

    if (this.dataFactory) {
      ctx.data = this.dataFactory();
    }

    return this.access(ctx, action, meta);
  };

  /**
   * wraps the process hook to extract the creatorID of the user
   */
  #process: AbstractActionControl<T, P, D>['process'] = (ctx, action, meta) => {
    AbstractActionControl.extractCreatorID(ctx, action);
    this.beforeProcess(ctx, action, meta);

    return this.process(ctx, action, meta);
  };

  setup(): void {
    this.server.type<Action<P>, D>(this.actionCreator.type, {
      access: this.#access,
      resend: this.resend,
      process: this.#process,
      finally: this.finally,
    });
  }
}

// access utilities

export const noAccess = (self: any): ActionAccessor<any, any> =>
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  async function (this: any) {
    return false;
    // eslint-disable-next-line no-extra-bind
  }.bind(self);

export abstract class AbstractNoopActionControl<T extends LoguxControlOptions, P> extends AbstractActionControl<T, P, BaseContextData> {
  protected access = noAccess(this);

  protected process = Utils.functional.noop;
}

export const unrestrictedAccess = (self: AbstractActionControl<any, any>): ActionAccessor<any, any> =>
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  async function (this: AbstractActionControl<any, any>, ctx: Context<any>) {
    return !!ctx.userId;
    // eslint-disable-next-line no-extra-bind
  }.bind(self);

// resend utilities

export const terminateResend: Resender<any, any> = async () => ({});

// payload utilities

export const sanitizePatch = <T extends { id: string }>(patch: Partial<T>) => {
  const { id: _, ...sanitized } = patch;

  return sanitized;
};
