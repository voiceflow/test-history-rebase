import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNodeActionControl } from './utils';

class RemovePortControl extends AbstractNodeActionControl<Realtime.node.AppendRemovePortPayload> {
  actionCreator = Realtime.node.removePort;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemovePortControl;
