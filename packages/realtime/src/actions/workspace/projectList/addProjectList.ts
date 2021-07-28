import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from '../utils';

class AddProjectList extends AbstractNoopWorkspaceActionControl<
  Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Realtime.ProjectList>
> {
  actionCreator = Realtime.projectList.crudActions.add;
}

export default AddProjectList;
