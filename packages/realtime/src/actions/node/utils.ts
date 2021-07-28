/* eslint-disable max-classes-per-file, @typescript-eslint/ban-types */
import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl, Resend } from '../utils';

export abstract class AbstractNodeActionControl<
  P extends Realtime.BaseNodePayload | Realtime.BaseBlockPayload,
  D extends object = {}
> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.diagram.canRead(action.payload.diagramID, Number(ctx.userId));
}

export abstract class AbstractResendNodeActionControl<
  P extends Realtime.BaseNodePayload | Realtime.BaseBlockPayload,
  D extends object = {}
> extends AbstractNodeActionControl<P, D> {
  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.diagram({
      diagramID: action.payload.diagramID,
      projectID: action.payload.projectID,
      workspaceID: action.payload.workspaceID,
    }),
  });
}

export abstract class NoopNodeActionControl<
  P extends Realtime.BaseNodePayload | Realtime.BaseBlockPayload,
  D extends object = {}
> extends AbstractResendNodeActionControl<P, D> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process = async (): Promise<void> => {};
}
