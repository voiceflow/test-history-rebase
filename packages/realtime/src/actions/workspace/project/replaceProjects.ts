import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from '../utils';

class ReplaceProjects extends AbstractNoopWorkspaceActionControl<
  Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuesPayload<Realtime.AnyProject>
> {
  actionCreator = Realtime.project.crudActions.replace;
}

export default ReplaceProjects;
