import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractNoopActionControl } from '@/legacy/actions/utils';

class AddWorkspace extends AbstractNoopActionControl<Realtime.actionUtils.CRUDValuePayload<Realtime.Workspace>> {
  protected actionCreator = Realtime.workspace.crud.add;
}

export default AddWorkspace;
