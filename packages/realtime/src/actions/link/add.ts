import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddLink extends AbstractDiagramActionControl<Realtime.link.AddPayload> {
  actionCreator = Realtime.link.add;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddLink;
