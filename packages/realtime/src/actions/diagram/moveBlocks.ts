import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractDiagramActionControl } from './utils';

class MoveBlocksControl extends AbstractDiagramActionControl<ActionCreatorPayload<typeof Realtime.diagram.moveBlocks>> {
  actionCreator = Realtime.diagram.moveBlocks;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default MoveBlocksControl;
