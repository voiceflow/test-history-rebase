import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

class RemoveThread extends AbstractProjectChannelControl<Realtime.BaseProjectPayload & Realtime.actionUtils.CRUDKeyPayload> {
  protected actionCreator = Realtime.thread.crud.remove;

  protected process = Utils.functional.noop;
}

export default RemoveThread;
