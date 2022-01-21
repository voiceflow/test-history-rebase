import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractProjectChannelControl } from '@/actions/project/utils';

type AddVariableStatePayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.VariableState>;

class AddVariableState extends AbstractProjectChannelControl<AddVariableStatePayload> {
  protected actionCreator = Realtime.variableState.crud.add;

  process = Utils.functional.noop;
}

export default AddVariableState;
