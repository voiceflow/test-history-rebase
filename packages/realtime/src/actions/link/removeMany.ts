import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class RemoveManyLinks extends AbstractDiagramActionControl<Realtime.link.RemoveManyPayload> {
  actionCreator = Realtime.link.removeMany;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveManyLinks;
