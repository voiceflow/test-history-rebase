import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

class AddThread extends AbstractProjectChannelControl<Realtime.BaseProjectPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Thread>> {
  protected actionCreator = Realtime.thread.crud.add;

  // handled by create
  protected process = Utils.functional.noop;
}

export default AddThread;
