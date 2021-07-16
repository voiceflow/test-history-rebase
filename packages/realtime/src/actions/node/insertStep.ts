import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractNodeActionControl } from './utils';

class InsertStepControl extends AbstractNodeActionControl<ActionCreatorPayload<typeof Realtime.node.insertStep>> {
  actionCreator = Realtime.node.insertStep;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default InsertStepControl;
