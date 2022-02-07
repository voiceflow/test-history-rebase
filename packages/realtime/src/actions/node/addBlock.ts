import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from '@/actions/diagram/utils';

class AddBlock extends AbstractDiagramActionControl<Realtime.node.AddBlockPayload> {
  actionCreator = Realtime.node.addBlock;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddBlock;
