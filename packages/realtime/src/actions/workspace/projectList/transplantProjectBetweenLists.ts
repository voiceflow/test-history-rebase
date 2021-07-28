import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractNoopWorkspaceActionControl } from '../utils';

class TransplantProjectBetweenLists extends AbstractNoopWorkspaceActionControl<Realtime.projectList.TransplantProjectBetweenListsPayload> {
  actionCreator = Realtime.projectList.transplantProjectBetweenLists;
}

export default TransplantProjectBetweenLists;
