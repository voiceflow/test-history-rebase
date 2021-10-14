import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractWorkspaceChannelControl } from '../utils';

class AddWorkspaceMember extends AbstractWorkspaceChannelControl<Realtime.workspace.member.AddMemberPayload> {
  protected actionCreator = Realtime.workspace.member.add;

  protected process = Realtime.Utils.functional.noop;
}

export default AddWorkspaceMember;
