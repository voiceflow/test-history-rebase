import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddDynamicPort extends AbstractDiagramActionControl<Realtime.node.AddDynamicPortPayload> {
  actionCreator = Realtime.node.addDynamicPort;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddDynamicPort;
