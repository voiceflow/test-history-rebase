import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNodeActionControl } from './utils';

class RemoveStepControl extends AbstractNodeActionControl<Realtime.node.BaseStepPayload> {
  actionCreator = Realtime.node.removeStep;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveStepControl;
