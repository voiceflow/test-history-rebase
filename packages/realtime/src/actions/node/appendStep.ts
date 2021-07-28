import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNodeActionControl } from './utils';

class AppendStepControl extends AbstractNodeActionControl<Realtime.node.AppendStepPayload> {
  actionCreator = Realtime.node.appendStep;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AppendStepControl;
