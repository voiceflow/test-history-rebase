import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNodeActionControl } from './utils';

class AppendPortControl extends AbstractNodeActionControl<Realtime.node.AppendRemovePortPayload> {
  actionCreator = Realtime.node.appendPort;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AppendPortControl;
