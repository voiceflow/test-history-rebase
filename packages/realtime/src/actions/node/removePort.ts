import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemovePort extends AbstractDiagramActionControl<Realtime.node.PortPayload> {
  actionCreator = Realtime.node.removePort;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemovePort;
