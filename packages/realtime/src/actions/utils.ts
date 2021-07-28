/* eslint-disable @typescript-eslint/ban-types, max-classes-per-file */
import type { Context, ServerMeta } from '@logux/server';
import type { Resend } from '@logux/server/base-server';
import type { Action, ActionCreator } from 'typescript-fsa';

import { AbstractLoguxControl } from '../control';

export type { Resend } from '@logux/server/base-server';

export abstract class AbstractActionControl<P, D extends object = {}> extends AbstractLoguxControl {
  protected abstract actionCreator: ActionCreator<P>;

  protected abstract access: (ctx: Context<D>, action: Action<P>, meta: ServerMeta) => boolean | Promise<boolean>;

  protected abstract process: (ctx: Context<D>, action: Action<P>, meta: ServerMeta) => void | Promise<void>;

  protected resend: ((ctx: Context<D>, action: Action<P>, meta: ServerMeta) => Resend | Promise<Resend>) | undefined = undefined;

  protected finally: ((ctx: Context<D>, action: Action<P>, meta: ServerMeta) => void) | undefined = undefined;

  setup(): void {
    this.server.type<Action<P>, D>(this.actionCreator.type, {
      access: this.access,
      resend: this.resend,
      process: this.process,
      finally: this.finally,
    });
  }
}

export abstract class NoopActionControl<P, D extends object = {}> extends AbstractActionControl<P, D> {
  protected access = (): boolean | Promise<boolean> => true;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected process = (): void => {};
}
