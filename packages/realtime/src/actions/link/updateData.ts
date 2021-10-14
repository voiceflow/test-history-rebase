import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractLinkActionControl } from './utils';

class UpdateLinkData extends AbstractLinkActionControl<Realtime.link.UpdateDataPayload> {
  actionCreator = Realtime.link.updateData;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default UpdateLinkData;
