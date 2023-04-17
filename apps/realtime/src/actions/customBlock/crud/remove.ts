import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDKeyPayload {}

class RemoveCustomBlock extends AbstractProjectChannelControl<Payload> {
  protected actionCreator = Realtime.customBlock.crud.remove;

  protected process = Utils.functional.noop;
}

export default RemoveCustomBlock;
