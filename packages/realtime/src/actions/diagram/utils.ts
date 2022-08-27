// eslint-disable-next-line max-classes-per-file
import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseContextData, Context, Resend } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/actions/utils';
import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { WorkspaceContextData } from '@/actions/workspace/utils';

export abstract class AbstractDiagramActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.diagram.access.canRead(ctx.data.creatorID, action.payload.diagramID);

  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.diagram.build({
      diagramID: action.payload.diagramID,
      projectID: action.payload.projectID,
      versionID: action.payload.versionID,
      workspaceID: action.payload.workspaceID,
    }),
  });
}

export abstract class AbstractVersionDiagramAccessActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractDiagramActionControl<P, D> {
  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.version.build({
      projectID: action.payload.projectID,
      versionID: action.payload.versionID,
      workspaceID: action.payload.workspaceID,
    }),
  });
}

export abstract class AbstractNoopDiagramActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractDiagramActionControl<P, D> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process = async (): Promise<void> => {};
}

export abstract class AbstractDiagramResourceControl<
  P extends Realtime.BaseVersionPayload,
  D extends WorkspaceContextData = WorkspaceContextData
> extends AbstractVersionResourceControl<P, D> {}
