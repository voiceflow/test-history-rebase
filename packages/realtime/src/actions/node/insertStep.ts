import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNodeActionControl } from './utils';

class InsertStepControl extends AbstractNodeActionControl<Realtime.node.InsertStepPayload> {
  actionCreator = Realtime.node.insertStep;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default InsertStepControl;
