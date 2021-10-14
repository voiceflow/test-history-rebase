import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractLinkActionControl } from './utils';

class RemoveLink extends AbstractLinkActionControl<Realtime.BaseLinkPayload> {
  actionCreator = Realtime.link.remove;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveLink;
