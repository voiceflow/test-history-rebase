import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractDiagramResourceControl } from '../utils';

class UpdateStartingBlockControl extends AbstractDiagramResourceControl<Realtime.diagram.UpdateStartingBlockPayload> {
  protected actionCreator = Realtime.diagram.updateStartingBlock;

  protected process = Utils.functional.noop;
}

export default UpdateStartingBlockControl;
