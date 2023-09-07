import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { resendProjectChannel } from '@/actions/project/utils';
import { AbstractNoopActionControl } from '@/actions/utils';

class AddDiagram extends AbstractNoopActionControl<Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Diagram>> {
  protected actionCreator = Realtime.diagram.crud.add;

  protected resend = resendProjectChannel;
}

export default AddDiagram;
