import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveBuiltinPort extends AbstractDiagramActionControl<Realtime.BasePortPayload> {
  actionCreator = Realtime.port.removeBuiltin;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveBuiltinPort;
