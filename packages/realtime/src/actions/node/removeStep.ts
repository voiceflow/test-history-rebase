import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractNodeActionControl } from './utils';

class RemoveStepControl extends AbstractNodeActionControl<ActionCreatorPayload<typeof Realtime.node.removeStep>> {
  actionCreator = Realtime.node.removeStep;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveStepControl;
