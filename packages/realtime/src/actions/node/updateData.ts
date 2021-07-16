import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractNodeActionControl } from './utils';

class UpdateNodeDataControl extends AbstractNodeActionControl<ActionCreatorPayload<typeof Realtime.node.updateData>> {
  actionCreator = Realtime.node.updateData;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default UpdateNodeDataControl;
