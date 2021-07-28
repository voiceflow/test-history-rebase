/* eslint-disable max-classes-per-file, @typescript-eslint/ban-types */
import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl, Resend } from '../utils';

export abstract class AbstractProjectActionControl<P extends Realtime.BaseProjectPayload, D extends object = {}> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.project.canRead(action.payload.projectID, Number(ctx.userId));
}

export abstract class AbstractResendProjectActionControl<
  P extends Realtime.BaseProjectPayload,
  D extends object = {}
> extends AbstractProjectActionControl<P, D> {
  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.project({
      projectID: action.payload.projectID,
      workspaceID: action.payload.workspaceID,
    }),
  });
}

export abstract class AbstractNoopProjectActionControl<
  P extends Realtime.BaseProjectPayload,
  D extends object = {}
> extends AbstractResendProjectActionControl<P, D> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process = async (): Promise<void> => {};
}
