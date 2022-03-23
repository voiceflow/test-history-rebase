import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class PatchManyLinks extends AbstractDiagramActionControl<Realtime.link.PatchManyPayload> {
  actionCreator = Realtime.link.patchMany;

  process = async (ctx: Context, { payload }: Action<Realtime.link.PatchManyPayload>): Promise<void> => {
    await this.services.diagram.patchManyLinks(
      ctx.data.creatorID,
      payload.diagramID,
      payload.patches.map((patch) => ({ nodeID: patch.nodeID, portID: patch.portID, data: patch.data }))
    );
  };
}

export default PatchManyLinks;
