import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractLinkActionControl } from './utils';

class AddLinkActionControl extends AbstractLinkActionControl<Realtime.link.AddPayload> {
  actionCreator = Realtime.link.add;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddLinkActionControl;
