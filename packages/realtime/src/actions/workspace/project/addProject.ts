import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from '../utils';

class AddProject extends AbstractNoopWorkspaceActionControl<
  Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Realtime.AnyProject>
> {
  actionCreator = Realtime.project.crudActions.add;
}

export default AddProject;
