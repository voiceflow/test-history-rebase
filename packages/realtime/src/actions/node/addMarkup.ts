import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddMarkup extends AbstractDiagramActionControl<Realtime.node.AddMarkupPayload> {
  actionCreator = Realtime.node.addMarkup;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddMarkup;
