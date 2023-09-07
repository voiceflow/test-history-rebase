import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { resendProjectChannel } from '@/legacy/actions/project/utils';
import { AbstractNoopActionControl } from '@/legacy/actions/utils';

interface RemoveDiagramPayload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDKeyPayload {}

class RemoveDiagram extends AbstractNoopActionControl<RemoveDiagramPayload> {
  protected actionCreator = Realtime.diagram.crud.remove;

  protected resend = resendProjectChannel;
}

export default RemoveDiagram;
