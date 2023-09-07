import * as Realtime from '@voiceflow/realtime-sdk';

import { resendProjectChannel } from '@/actions/project/utils';
import { AbstractNoopActionControl } from '@/actions/utils';

class AddManyDiagram extends AbstractNoopActionControl<Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuesPayload<Realtime.Diagram>> {
  protected actionCreator = Realtime.diagram.crud.addMany;

  protected resend = resendProjectChannel;
}

export default AddManyDiagram;
