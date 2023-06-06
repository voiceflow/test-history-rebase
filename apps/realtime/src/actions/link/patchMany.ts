import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class PatchManyLinks extends AbstractDiagramActionControl<Realtime.link.PatchManyPayload> {
  actionCreator = Realtime.link.patchMany;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.PatchManyPayload>): Promise<void> => {
    await this.services.diagram.patchManyLinks(
      payload.diagramID,
      payload.patches.map((patch) =>
        patch.type ? { nodeID: patch.nodeID, type: patch.type, data: patch.data } : { nodeID: patch.nodeID, portID: patch.portID, data: patch.data }
      )
    );
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.PatchManyPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default PatchManyLinks;
