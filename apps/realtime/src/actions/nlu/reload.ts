import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class ReloadNluUnclassifiedData extends AbstractWorkspaceChannelControl<Realtime.nlu.ReloadPayload> {
  protected actionCreator = Realtime.nlu.reload;

  protected process = Utils.functional.noop;
}

export default ReloadNluUnclassifiedData;
