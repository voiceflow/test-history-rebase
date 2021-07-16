import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractProjectActionControl } from './utils';

class SetProjectImageControl extends AbstractProjectActionControl<ActionCreatorPayload<typeof Realtime.project.setImage>> {
  actionCreator = Realtime.project.setImage;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default SetProjectImageControl;
