import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramActionControl } from './utils';

class MoveBlocksControl extends AbstractDiagramActionControl<Realtime.diagram.DragMoveBlocksPayload> {
  actionCreator = Realtime.diagram.moveBlocks;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default MoveBlocksControl;
