/* eslint-disable max-classes-per-file */
import type { ServerMeta } from '@logux/server';
import type { Resend } from '@logux/server/base-server';
import { Eventual, Utils } from '@voiceflow/common';
import type { Action, ActionCreator, AsyncActionCreators } from 'typescript-fsa';

import { BaseContextData, Context } from '@/types';

import { AbstractLoguxControl } from '../control';

export type { Resend } from '@logux/server/base-server';

export type ActionAccessor<P, D extends BaseContextData = BaseContextData> = (
  ctx: Context<D>,
  action: Action<P>,
  meta: ServerMeta
) => Eventual<boolean>;

export type BoundActionAccessor<P, D extends BaseContextData = BaseContextData> = (
  this: AbstractActionControl<P, D>,
  ctx: Context<D>,
  action: Action<P>,
  meta: ServerMeta
) => Eventual<boolean>;

export type Resender<P, D extends BaseContextData = BaseContextData> = (ctx: Context<D>, action: Action<P>, meta: ServerMeta) => Eventual<Resend>;

export abstract class AbstractActionControl<P, D extends BaseContextData = BaseContextData> extends AbstractLoguxControl {
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

  /**
   * wraps the access hook to add an optional initializer for the context data
   */
  #access: AbstractActionControl<P, D>['access'] = (ctx, action, meta) => {
    AbstractActionControl.extractCreatorID(ctx, action);

    if (this.dataFactory) {
      ctx.data = this.dataFactory();
    }

    return this.access(ctx, action, meta);
  };

  /**
   * wraps the process hook to extract the creatorID of the user
   */
  #process: AbstractActionControl<P, D>['process'] = (ctx, action, meta) => {
    AbstractActionControl.extractCreatorID(ctx, action);

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

export const noAccess = (self: AbstractActionControl<any, any>): ActionAccessor<any, any> =>
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  async function (this: AbstractActionControl<any, any>) {
    return false;
    // eslint-disable-next-line no-extra-bind
  }.bind(self);

export abstract class AbstractNoopActionControl<P> extends AbstractActionControl<P, BaseContextData> {
  protected access = noAccess(this);

  protected process = Utils.functional.noop;
}

export const unrestrictedAccess = (self: AbstractActionControl<any, any>): ActionAccessor<any, any> =>
  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  async function (this: AbstractActionControl<any, any>, ctx: Context<any>) {
    return !!ctx.userId;
    // eslint-disable-next-line no-extra-bind
  }.bind(self);

export const terminateResend: Resender<any, any> = async () => ({});

export const sanitizePatch = <T extends { id: string }>(patch: Partial<T>) => {
  const { id: _, ...sanitized } = patch;

  return sanitized;
};
