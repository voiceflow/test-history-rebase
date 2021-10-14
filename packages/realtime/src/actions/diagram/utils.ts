/* eslint-disable max-classes-per-file, @typescript-eslint/ban-types */
import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl, Resend } from '@/actions/utils';
import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { WorkspaceContextData } from '@/actions/workspace/utils';

export abstract class AbstractDiagramActionControl<P extends Realtime.BaseDiagramPayload, D extends object = {}> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.diagram.canRead(Number(ctx.userId), action.payload.diagramID);
}

export abstract class AbstractResendDiagramActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends object = {}
> extends AbstractDiagramActionControl<P, D> {
  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.diagram.build({
      diagramID: action.payload.diagramID,
      projectID: action.payload.projectID,
      workspaceID: action.payload.workspaceID,
    }),
  });
}

export abstract class AbstractNoopDiagramActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends object = {}
> extends AbstractResendDiagramActionControl<P, D> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  process = async (): Promise<void> => {};
}

export abstract class AbstractDiagramResourceControl<
  P extends Realtime.BaseVersionPayload,
  D extends WorkspaceContextData = WorkspaceContextData
> extends AbstractVersionResourceControl<P, D> {
  protected createDiagram = async (
    ctx: Context<WorkspaceContextData>,
    payload: P,
    primitiveDiagram: Realtime.Utils.diagram.PrimitiveDiagram
  ): Promise<Realtime.Diagram> => {
    const creatorID = Number(ctx.userId);
    const { rootDiagramID } = await this.services.version.get(creatorID, payload.versionID);

    const diagram = await this.services.diagram
      .create(Number(ctx.userId), {
        ...primitiveDiagram,
        creatorID,
        versionID: payload.versionID,
      })
      .then((dbDiagram) => Realtime.Adapters.diagramAdapter.fromDB(dbDiagram, { rootDiagramID }));

    await this.server.process(
      Realtime.diagram.crud.add({
        key: diagram.id,
        value: diagram,
        workspaceID: payload.workspaceID,
        projectID: payload.projectID,
        versionID: payload.versionID,
      })
    );

    return diagram;
  };
}
