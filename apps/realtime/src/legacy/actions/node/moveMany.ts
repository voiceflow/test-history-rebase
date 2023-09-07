import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class MoveManyNodes extends AbstractDiagramActionControl<Realtime.node.TranslatePayload> {
  actionCreator = Realtime.node.moveMany;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.node.TranslatePayload>): Promise<void> => {
    await this.services.diagram.updateNodeCoords(payload.diagramID, payload.blocks);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.node.TranslatePayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.services.domain.setUpdatedBy(payload.versionID, payload.domainID, ctx.data.creatorID),
    ]);
  };
}

export default MoveManyNodes;
