import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class InsertStep extends AbstractDiagramActionControl<Realtime.node.InsertStepPayload> {
  actionCreator = Realtime.node.insertStep;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default InsertStep;
