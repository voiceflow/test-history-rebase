import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddByKeyLink extends AbstractDiagramActionControl<Realtime.link.AddByKeyPayload> {
  actionCreator = Realtime.link.addByKey;

  process = async (ctx: Context, { payload }: Action<Realtime.link.AddByKeyPayload>): Promise<void> => {
    await this.services.diagram.addByKeyLink(ctx.data.creatorID, payload.diagramID, payload.sourceNodeID, payload.key, payload.targetNodeID);
  };
}

export default AddByKeyLink;
