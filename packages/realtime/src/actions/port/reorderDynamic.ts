import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class ReorderDynamicPort extends AbstractDiagramActionControl<Realtime.port.ReorderDynamicPayload> {
  actionCreator = Realtime.port.reorderDynamic;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default ReorderDynamicPort;
