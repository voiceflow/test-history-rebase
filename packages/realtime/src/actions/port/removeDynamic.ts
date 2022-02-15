import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveDynamicPort extends AbstractDiagramActionControl<Realtime.BasePortPayload> {
  actionCreator = Realtime.port.removeDynamic;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveDynamicPort;
