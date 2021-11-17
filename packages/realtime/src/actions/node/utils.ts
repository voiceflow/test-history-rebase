/* eslint-disable max-classes-per-file */
import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseContextData, Context, Resend } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl } from '../utils';

export abstract class AbstractNodeActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.diagram.canRead(ctx.data.creatorID, action.payload.diagramID);
}

export abstract class AbstractResendNodeActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractNodeActionControl<P, D> {
  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.diagram.build({
      diagramID: action.payload.diagramID,
      projectID: action.payload.projectID,
      workspaceID: action.payload.workspaceID,
    }),
  });
}

export abstract class NoopNodeActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractResendNodeActionControl<P, D> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process = async (): Promise<void> => {};
}
