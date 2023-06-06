import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddByKeyLink extends AbstractDiagramActionControl<Realtime.link.AddByKeyPayload> {
  actionCreator = Realtime.link.addByKey;

  protected process = async (_ctx: Context, { payload }: Action<Realtime.link.AddByKeyPayload>): Promise<void> => {
    await this.services.diagram.addByKeyLink(payload.diagramID, payload.sourceNodeID, payload.key, payload.targetNodeID, payload.data);
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.link.AddByKeyPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default AddByKeyLink;
