import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from '../utils';

class AddNewStartingBlocksControl extends AbstractDiagramResourceControl<Realtime.diagram.AddNewStartingBlocksPayload> {
  protected actionCreator = Realtime.diagram.addNewStartingBlocks;

  protected process = Utils.functional.noop;
}

export default AddNewStartingBlocksControl;
