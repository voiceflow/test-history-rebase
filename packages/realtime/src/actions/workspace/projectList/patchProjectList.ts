import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from '../utils';

class RemoveProjectList extends AbstractNoopWorkspaceActionControl<
  Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.ProjectList>>
> {
  actionCreator = Realtime.projectList.crudActions.patch;
}

export default RemoveProjectList;
