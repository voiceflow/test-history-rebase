import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { resendProjectChannel } from '@/legacy/actions/project/utils';
import { AbstractNoopActionControl } from '@/legacy/actions/utils';

interface RemoveDiagramPayload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDKeysPayload {}

class RemoveDiagram extends AbstractNoopActionControl<RemoveDiagramPayload> {
  protected actionCreator = Realtime.diagram.crud.removeMany;

  protected resend = resendProjectChannel;
}

export default RemoveDiagram;
