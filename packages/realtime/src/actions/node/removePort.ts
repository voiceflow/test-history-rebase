import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNodeActionControl } from './utils';

class RemovePort extends AbstractNodeActionControl<Realtime.node.PortPayload> {
  actionCreator = Realtime.node.removePort;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemovePort;
