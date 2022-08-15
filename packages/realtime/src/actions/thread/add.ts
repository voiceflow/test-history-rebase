import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class AddThread extends AbstractWorkspaceChannelControl<Realtime.BaseProjectPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Thread>> {
  protected actionCreator = Realtime.thread.crud.add;

  // handled by create
  protected process = Utils.functional.noop;
}

export default AddThread;
