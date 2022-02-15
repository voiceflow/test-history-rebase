import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddDynamicPort extends AbstractDiagramActionControl<Realtime.port.AddDynamicPayload> {
  actionCreator = Realtime.port.addDynamic;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddDynamicPort;
