import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class UpdateNodeData extends AbstractDiagramActionControl<Realtime.node.UpdateDataPayload> {
  actionCreator = Realtime.node.updateData;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default UpdateNodeData;
