import * as Realtime from '@voiceflow/realtime-sdk';

import { ActionCreatorPayload } from '../utils';
import { AbstractDiagramActionControl } from './utils';

class AddBlocksControl extends AbstractDiagramActionControl<ActionCreatorPayload<typeof Realtime.diagram.addBlocks>> {
  actionCreator = Realtime.diagram.addBlocks;

  process = async (): Promise<void> => {
    // TODO: add process
  };
}

export default AddBlocksControl;
