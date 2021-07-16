import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractDiagramActionControl } from './utils';

class RemoveBlocksControl extends AbstractDiagramActionControl<ActionCreatorPayload<typeof Realtime.diagram.removeBlocks>> {
  actionCreator = Realtime.diagram.removeBlocks;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default RemoveBlocksControl;
