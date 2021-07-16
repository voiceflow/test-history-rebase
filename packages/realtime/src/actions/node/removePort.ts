import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractNodeActionControl } from './utils';

class RemovePortControl extends AbstractNodeActionControl<ActionCreatorPayload<typeof Realtime.node.removePort>> {
  actionCreator = Realtime.node.removePort;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemovePortControl;
