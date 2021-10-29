import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNodeActionControl } from './utils';

class AppendPort extends AbstractNodeActionControl<Realtime.node.PortPayload> {
  actionCreator = Realtime.node.appendPort;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AppendPort;
