import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class RemoveThread extends AbstractWorkspaceChannelControl<Realtime.BaseProjectPayload & Realtime.actionUtils.CRUDKeyPayload> {
  protected actionCreator = Realtime.thread.crud.remove;

  protected process = Utils.functional.noop;
}

export default RemoveThread;
