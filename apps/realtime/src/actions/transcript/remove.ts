import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

class RemoveTranscript extends AbstractProjectChannelControl<Realtime.BaseProjectPayload & Realtime.actionUtils.CRUDKeyPayload> {
  protected actionCreator = Realtime.transcript.crud.remove;

  protected process = Utils.functional.noop;
}

export default RemoveTranscript;
