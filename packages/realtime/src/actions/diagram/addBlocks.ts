import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from './utils';

class AddBlocksControl extends AbstractDiagramActionControl<Realtime.diagram.AddRemoveBlocksPayload> {
  actionCreator = Realtime.diagram.addBlocks;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddBlocksControl;
