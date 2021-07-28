import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from '../utils';

class RemoveProjectList extends AbstractNoopWorkspaceActionControl<Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeyPayload> {
  actionCreator = Realtime.projectList.crudActions.remove;
}

export default RemoveProjectList;
