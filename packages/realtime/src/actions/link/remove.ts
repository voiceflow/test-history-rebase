import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractLinkActionControl } from './utils';

class RemoveLinkActionControl extends AbstractLinkActionControl<ActionCreatorPayload<typeof Realtime.link.remove>> {
  actionCreator = Realtime.link.remove;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveLinkActionControl;
