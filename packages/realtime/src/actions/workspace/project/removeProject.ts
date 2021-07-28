import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from '../utils';

class RemoveProject extends AbstractNoopWorkspaceActionControl<Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeyPayload> {
  actionCreator = Realtime.project.crudActions.remove;
}

export default RemoveProject;
