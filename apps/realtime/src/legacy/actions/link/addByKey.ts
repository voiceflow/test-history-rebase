import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/legacy/actions/diagram/utils';

class AddByKeyLink extends AbstractDiagramActionControl<Realtime.link.AddByKeyPayload> {
  actionCreator = Realtime.link.addByKey;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.AddByKeyPayload>): Promise<void> => {
    await this.services.diagram.addByKeyLink(payload.versionID, payload.diagramID, payload.sourceNodeID, {
      key: payload.key,
      target: payload.targetNodeID,
      data: payload.data,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.AddByKeyPayload>): Promise<void> => {
    await Promise.all([
      this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID),
      this.setCMSUpdatedBy(ctx, payload),
    ]);
  };
}

export default AddByKeyLink;
