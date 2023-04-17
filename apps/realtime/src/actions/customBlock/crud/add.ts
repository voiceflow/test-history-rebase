import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuePayload<Realtime.CustomBlock> {}

class AddCustomBlock extends AbstractProjectChannelControl<Payload> {
  protected actionCreator = Realtime.customBlock.crud.add;

  protected process = Utils.functional.noop;
}

export default AddCustomBlock;
