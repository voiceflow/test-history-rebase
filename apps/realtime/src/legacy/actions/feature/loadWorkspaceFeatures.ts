import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractNoopActionControl } from '@/legacy/actions/utils';

// TODO: move to nestjs
class LoadAllFeatures extends AbstractNoopActionControl<Realtime.feature.LoadWorkspaceFeatures> {
  protected actionCreator = Realtime.feature.loadWorkspaceFeatures;

  protected process = Utils.functional.noop;
}

export default LoadAllFeatures;
