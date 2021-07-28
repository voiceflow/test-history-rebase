import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from './utils';

class RemoveBlocksControl extends AbstractDiagramActionControl<Realtime.diagram.AddRemoveBlocksPayload> {
  actionCreator = Realtime.diagram.removeBlocks;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveBlocksControl;
