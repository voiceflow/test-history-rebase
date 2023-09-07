import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { WorkspaceContextData } from '@/actions/workspace/utils';

import { AbstractDiagramResourceControl } from '../utils';

class ReorderMenuItem extends AbstractDiagramResourceControl<Realtime.diagram.ReorderMenuItemPayload> {
  protected actionCreator = Realtime.diagram.reorderMenuItem;

  protected process = async (_ctx: Context, { payload, meta }: Action<Realtime.diagram.ReorderMenuItemPayload>) => {
    if (meta?.skipPersist) return;

    await this.services.diagram.reorderMenuItems(payload.diagramID, { index: payload.toIndex, sourceID: payload.sourceID });
  };

  protected finally = async (
    ctx: Context<WorkspaceContextData>,
    { payload, meta }: Action<Realtime.diagram.ReorderMenuItemPayload>
  ): Promise<void> => {
    if (meta?.skipPersist) return;

    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default ReorderMenuItem;
