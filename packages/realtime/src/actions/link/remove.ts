import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveLink extends AbstractDiagramActionControl<Realtime.BaseLinkPayload> {
  actionCreator = Realtime.link.remove;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveLink;
