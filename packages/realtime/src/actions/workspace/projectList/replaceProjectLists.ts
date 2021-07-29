import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from '../utils';

class RemoveProjectsList extends AbstractNoopWorkspaceActionControl<
  Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuesPayload<Realtime.ProjectList>
> {
  actionCreator = Realtime.projectList.crudActions.replace;
}

export default RemoveProjectsList;
