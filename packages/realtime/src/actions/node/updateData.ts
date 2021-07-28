import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNodeActionControl } from './utils';

class UpdateNodeDataControl extends AbstractNodeActionControl<Realtime.node.UpdateDataPayload> {
  actionCreator = Realtime.node.updateData;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default UpdateNodeDataControl;
