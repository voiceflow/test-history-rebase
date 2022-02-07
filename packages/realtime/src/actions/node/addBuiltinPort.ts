import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddBuiltinPort extends AbstractDiagramActionControl<Realtime.node.AddBuiltinPortPayload> {
  actionCreator = Realtime.node.addBuiltinPort;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddBuiltinPort;
