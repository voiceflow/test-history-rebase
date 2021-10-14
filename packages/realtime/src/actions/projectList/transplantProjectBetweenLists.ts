import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class TransplantProjectBetweenLists extends AbstractWorkspaceChannelControl<Realtime.projectList.TransplantProjectBetweenListsPayload> {
  protected actionCreator = Realtime.projectList.transplantProjectBetweenLists;

  protected process = Realtime.Utils.functional.noop;
}

export default TransplantProjectBetweenLists;
