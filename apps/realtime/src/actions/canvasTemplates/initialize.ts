import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class InitializeControl extends AbstractVersionResourceControl<Realtime.canvasTemplate.SnapshotPayload> {
  protected actionCreator = Realtime.canvasTemplate.initialize;

  protected process = Utils.functional.noop;
}

export default InitializeControl;
