import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class ReloadSlots extends AbstractWorkspaceChannelControl<Realtime.slot.ReloadPayload> {
  protected actionCreator = Realtime.slot.reload;

  protected process = Utils.functional.noop;
}

export default ReloadSlots;
