import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from '../utils';

class MoveProjectList extends AbstractNoopWorkspaceActionControl<Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDMovePayload> {
  actionCreator = Realtime.projectList.crudActions.move;
}

export default MoveProjectList;
