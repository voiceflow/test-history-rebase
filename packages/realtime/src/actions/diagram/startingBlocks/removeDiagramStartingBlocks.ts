import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from '../utils';

class RemoveDiagramStartingBlocksControl extends AbstractDiagramResourceControl<Realtime.diagram.RemoveDiagramStartingBlocksPayload> {
  protected actionCreator = Realtime.diagram.removeDiagramStartingBlocks;

  protected process = Utils.functional.noop;
}

export default RemoveDiagramStartingBlocksControl;
