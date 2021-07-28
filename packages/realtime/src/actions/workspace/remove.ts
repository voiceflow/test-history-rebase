import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from './utils';

class RemoveWorkspace extends AbstractNoopWorkspaceActionControl<Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeyPayload> {
  actionCreator = Realtime.workspace.crudActions.remove;
}

export default RemoveWorkspace;
