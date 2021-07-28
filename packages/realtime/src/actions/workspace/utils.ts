/* eslint-disable max-classes-per-file, @typescript-eslint/ban-types */
import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl, Resend } from '../utils';

export abstract class AbstractWorkspaceActionControl<P extends Realtime.BaseWorkspacePayload, D extends object = {}> extends AbstractActionControl<
  P,
  D
> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.workspace.canRead(action.payload.workspaceID, Number(ctx.userId));
}

export abstract class AbstractResendWorkspaceActionControl<
  P extends Realtime.BaseWorkspacePayload,
  D extends object = {}
> extends AbstractWorkspaceActionControl<P, D> {
  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.workspace({ workspaceID: action.payload.workspaceID }),
  });
}

export abstract class AbstractNoopWorkspaceActionControl<
  P extends Realtime.BaseWorkspacePayload,
  D extends object = {}
> extends AbstractResendWorkspaceActionControl<P, D> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process = async (): Promise<void> => {};
}
