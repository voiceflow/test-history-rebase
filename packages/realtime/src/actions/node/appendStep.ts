import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractNodeActionControl } from './utils';

class AppendStepControl extends AbstractNodeActionControl<ActionCreatorPayload<typeof Realtime.node.appendStep>> {
  actionCreator = Realtime.node.appendStep;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AppendStepControl;
