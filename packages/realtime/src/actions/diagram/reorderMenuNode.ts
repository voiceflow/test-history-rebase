import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/actions/workspace/utils';

import { AbstractDiagramResourceControl } from './utils';

class ReorderMenuNodes extends AbstractDiagramResourceControl<Realtime.diagram.ReorderMenuNodePayload> {
  protected actionCreator = Realtime.diagram.reorderMenuNode;

  protected process = async (_ctx: Context, { payload, meta }: Action<Realtime.diagram.ReorderMenuNodePayload>) => {
    if (meta?.skipPersist) return;

    await this.services.diagram.reorderMenuNodes({ index: payload.toIndex, nodeID: payload.nodeID, diagramID: payload.diagramID });
  };

  protected finally = async (ctx: Context<WorkspaceContextData>, { payload }: Action<Realtime.diagram.ReorderMenuNodePayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default ReorderMenuNodes;
