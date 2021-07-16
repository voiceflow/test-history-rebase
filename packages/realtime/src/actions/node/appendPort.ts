import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractNodeActionControl } from './utils';

class AppendPortControl extends AbstractNodeActionControl<ActionCreatorPayload<typeof Realtime.node.appendPort>> {
  actionCreator = Realtime.node.appendPort;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AppendPortControl;
