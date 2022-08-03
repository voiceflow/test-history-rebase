import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddDynamicLink extends AbstractDiagramActionControl<Realtime.link.AddDynamicPayload> {
  actionCreator = Realtime.link.addDynamic;

  process = async (_ctx: Context, { payload }: Action<Realtime.link.AddDynamicPayload>): Promise<void> => {
    await this.services.diagram.addDynamicLink(payload.diagramID, payload.sourceNodeID, payload.sourcePortID, payload.targetNodeID);
  };
}

export default AddDynamicLink;
