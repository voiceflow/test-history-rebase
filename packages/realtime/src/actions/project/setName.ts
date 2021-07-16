import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractProjectActionControl } from './utils';

class SetProjectNameControl extends AbstractProjectActionControl<ActionCreatorPayload<typeof Realtime.project.setName>> {
  actionCreator = Realtime.project.setName;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default SetProjectNameControl;
