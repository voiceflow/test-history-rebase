// eslint-disable-next-line max-classes-per-file
import { AnyRecord, BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseContextData, Context, Resend } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/actions/utils';
import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { WorkspaceContextData } from '@/actions/workspace/utils';

export interface NewDiagram {
  id: string;
  nodes?: Record<string, BaseModels.BaseDiagramNode<AnyRecord>>;
}

export interface NewDiagramContextData extends WorkspaceContextData {
  newDiagram: NewDiagram;
}

export abstract class AbstractDiagramActionControl<
  P extends Realtime.BaseDiagramPayload,
  D extends BaseContextData = BaseContextData
> extends AbstractActionControl<P, D> {
  protected access = (ctx: Context<D>, action: Action<P>): Promise<boolean> =>
    this.services.diagram.canRead(ctx.data.creatorID, action.payload.diagramID);

  protected resend = (_: Context<D>, action: Action<P>): Resend => ({
    channel: Realtime.Channels.diagram.build({
      diagramID: action.payload.diagramID,
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
> extends AbstractVersionResourceControl<P, D> {
  protected createDiagram = async (
    ctx: Context<WorkspaceContextData>,
    payload: P,
    primitiveDiagram: Realtime.Utils.diagram.PrimitiveDiagram
  ): Promise<Realtime.Diagram> => {
    const { creatorID } = ctx.data;
    const { rootDiagramID } = await this.services.version.get(creatorID, payload.versionID);

    const diagram = await this.services.diagram
      .create(creatorID, {
        ...primitiveDiagram,
        creatorID,
        versionID: payload.versionID,
      })
      .then((dbDiagram) => Realtime.Adapters.diagramAdapter.fromDB(dbDiagram, { rootDiagramID }));

    await this.server.processAs(
      creatorID,
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

  protected reloadStartingBlocksFromNewDiagram = async (ctx: Context<WorkspaceContextData>, payload: P, newDiagram?: NewDiagram): Promise<void> => {
    if (!newDiagram || !newDiagram.nodes) return;
    const { creatorID } = ctx.data;
    const { versionID, projectID, workspaceID } = payload;
    const actionContext = { versionID, projectID, workspaceID };

    const startingBlocks =
      newDiagram.nodes &&
      Object.values(newDiagram.nodes)
        .filter((node) => node.type === Realtime.NODE_BLOCK_TYPE)
        .map((node) => ({ blockID: node.nodeID, name: node.data.name }));

    if (startingBlocks && startingBlocks.length > 0) {
      await this.server.processAs(creatorID, Realtime.diagram.addNewStartingBlocks({ ...actionContext, diagramID: newDiagram.id, startingBlocks }));
    }
  };
}
