import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractDiagramResourceControl } from './utils';

class ReloadSharedNodes extends AbstractDiagramResourceControl<Realtime.diagram.sharedNodes.ReloadPayload> {
  protected actionCreator = Realtime.diagram.sharedNodes.reload;

  protected process = Utils.functional.noop;
}

export default ReloadSharedNodes;
