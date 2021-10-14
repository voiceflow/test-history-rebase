/* eslint-disable @typescript-eslint/ban-types */
import type { Context, ServerMeta } from '@logux/server';
import type { Resend } from '@logux/server/base-server';
import { Eventual } from '@voiceflow/common';
import type { Action, ActionCreator, AsyncActionCreators } from 'typescript-fsa';

import { AbstractLoguxControl } from '../control';

export type { Resend } from '@logux/server/base-server';

export type ActionAccessor<P, D extends object = {}> = (ctx: Context<D>, action: Action<P>, meta: ServerMeta) => Eventual<boolean>;

export type BoundActionAccessor<P, D extends object = {}> = (
  this: AbstractActionControl<P, D>,
  ctx: Context<D>,
  action: Action<P>,
  meta: ServerMeta
) => Eventual<boolean>;

export type Resender<P, D extends object = {}> = (ctx: Context<D>, action: Action<P>, meta: ServerMeta) => Eventual<Resend>;

export abstract class AbstractActionControl<P, D extends object = {}> extends AbstractLoguxControl {
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

        await ctx.sendBack(actionCreators.done({ params: action.payload, result }, { actionID: meta.id }));
      } catch (err) {
        await ctx.sendBack(actionCreators.failed({ params: action.payload, error: err }));
      }
    };
  }

  /**
   * wraps the access hook to add an optional initializer for the context data
   */
  #access: AbstractActionControl<P, D>['access'] = (ctx, action, meta) => {
    if (this.dataFactory) {
      ctx.data = this.dataFactory();
    }

    return this.access(ctx, action, meta);
  };

  setup(): void {
    this.server.type<Action<P>, D>(this.actionCreator.type, {
      access: this.#access,
      resend: this.resend,
      process: this.process,
      finally: this.finally,
    });
  }
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export async function unrestrictedAccess(ctx: Context<any>) {
  return !!ctx.userId;
}

export const terminateResend: Resender<any, any> = async () => ({});

export const sanitizePatch = <T extends { id: string }>(patch: Partial<T>) => {
  const { id: _, ...sanitized } = patch;

  return sanitized;
};
