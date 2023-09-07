import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractWorkspaceChannelControl } from '@/legacy/actions/workspace/utils';

class ReloadIntents extends AbstractWorkspaceChannelControl<Realtime.intent.ReloadPayload> {
  protected actionCreator = Realtime.intent.reload;

  protected process = Utils.functional.noop;
}

export default ReloadIntents;
