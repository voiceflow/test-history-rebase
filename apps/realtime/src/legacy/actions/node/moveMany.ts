import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class MoveManyNodes extends AbstractDiagramActionControl<Realtime.node.TranslatePayload> {
  actionCreator = Realtime.node.moveMany;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.TranslatePayload>): Promise<void> => {
    await this.services.diagram.updateNodeCoords(payload.versionID, payload.diagramID, payload.blocks);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.TranslatePayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default MoveManyNodes;
