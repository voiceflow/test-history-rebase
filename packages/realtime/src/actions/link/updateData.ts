import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractLinkActionControl } from './utils';

class UpdateDataLinkActionControl extends AbstractLinkActionControl<ActionCreatorPayload<typeof Realtime.link.updateData>> {
  actionCreator = Realtime.link.updateData;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default UpdateDataLinkActionControl;
