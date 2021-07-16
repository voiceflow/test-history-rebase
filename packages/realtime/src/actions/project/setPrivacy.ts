import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractProjectActionControl } from './utils';

class SetProjectPrivacyControl extends AbstractProjectActionControl<ActionCreatorPayload<typeof Realtime.project.setPrivacy>> {
  actionCreator = Realtime.project.setPrivacy;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default SetProjectPrivacyControl;
