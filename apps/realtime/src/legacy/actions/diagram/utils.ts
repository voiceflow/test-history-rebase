/* eslint-disable max-classes-per-file */

import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { BaseContextData, Context, Resend } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/legacy/actions/utils';
import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';
import { WorkspaceContextData } from '@/legacy/actions/workspace/utils';

export abstract class AbstractDiagramActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends BaseContextData = BaseContextData,
> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.version.access.canRead(ctx.data.creatorID, action.payload.versionID);

  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.diagram.build({
      diagramID: action.payload.diagramID,
      projectID: action.payload.projectID,
      versionID: action.payload.versionID,
      workspaceID: action.payload.workspaceID,
    }),
  });

  protected setCMSUpdatedBy = async (ctx: Context<BaseContextData>, payload: P): Promise<void> => {
    try {
      await this.services.requestContext.createAsync(() =>
        Promise.all([
          this.services.flow.updateOneByDiagramIDAndBroadcast(
            payload.diagramID,
            { updatedByID: ctx.data.creatorID },
            {
              auth: { userID: ctx.data.creatorID, clientID: ctx.data.clientID },
              context: { assistantID: payload.projectID, environmentID: payload.versionID },
            }
          ),
          this.services.workflow.updateOneByDiagramIDAndBroadcast(
            payload.diagramID,
            { updatedByID: ctx.data.creatorID },
            {
              auth: { userID: ctx.data.creatorID, clientID: ctx.data.clientID },
              context: { assistantID: payload.projectID, environmentID: payload.versionID },
            }
          ),
        ])
      );
    } catch {
      // do nothing
    }
  };
}

export abstract class AbstractVersionDiagramAccessActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends BaseContextData = BaseContextData,
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
  D extends BaseContextData = BaseContextData,
> extends AbstractDiagramActionControl<P, D> {
  // eslint-disable-next-line no-empty-function
  process = async (): Promise<void> => {};
}

export abstract class AbstractDiagramResourceControl<
  P extends Realtime.BaseVersionPayload,
  D extends WorkspaceContextData = WorkspaceContextData,
> extends AbstractVersionResourceControl<P, D> {}
