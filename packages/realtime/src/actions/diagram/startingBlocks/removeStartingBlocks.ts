import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from '../utils';

class RemoveStartingBlocksControl extends AbstractDiagramResourceControl<Realtime.diagram.RemoveStartingBlocksPayload> {
  protected actionCreator = Realtime.diagram.removeStartingBlocks;

  protected process = Utils.functional.noop;
}

export default RemoveStartingBlocksControl;
