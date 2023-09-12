import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/legacy/actions/workspace/utils';

import { AbstractDiagramResourceControl } from '../utils';

/**
 * @deprecated use `ReorderMenuItem` instead
 */
class ReorderMenuNode extends AbstractDiagramResourceControl<Realtime.diagram.ReorderMenuNodePayload> {
  protected actionCreator = Realtime.diagram.reorderMenuNode;

  protected process = async (_ctx: Context, { payload, meta }: Action<Realtime.diagram.ReorderMenuNodePayload>) => {
    if (meta?.skipPersist) return;

    await this.services.diagram.reorderMenuNodeIDs(payload.diagramID, { index: payload.toIndex, nodeID: payload.nodeID });
  };

  protected finally = async (
    ctx: Context<WorkspaceContextData>,
    { payload, meta }: Action<Realtime.diagram.ReorderMenuNodePayload>
  ): Promise<void> => {
    if (meta?.skipPersist) return;

    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default ReorderMenuNode;
