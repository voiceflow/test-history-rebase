import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from './utils';

class PatchWorkspace extends AbstractNoopWorkspaceActionControl<
  Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Workspace>>
> {
  actionCreator = Realtime.workspace.crudActions.patch;
}

export default PatchWorkspace;
