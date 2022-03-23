import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class MoveManyNodes extends AbstractDiagramActionControl<Realtime.node.TranslatePayload> {
  actionCreator = Realtime.node.moveMany;

  process = async (ctx: Context, { payload }: Action<Realtime.node.TranslatePayload>): Promise<void> => {
    await this.services.diagram.updateBlockCoords(ctx.data.creatorID, payload.diagramID, payload.blocks);
  };
}

export default MoveManyNodes;
