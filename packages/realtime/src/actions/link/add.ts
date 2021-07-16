import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractLinkActionControl } from './utils';

class AddLinkActionControl extends AbstractLinkActionControl<ActionCreatorPayload<typeof Realtime.link.add>> {
  actionCreator = Realtime.link.add;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddLinkActionControl;
