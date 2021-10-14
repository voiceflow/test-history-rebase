import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractWorkspaceChannelControl } from '../utils';

class ReplaceWorkspaceMembers extends AbstractWorkspaceChannelControl<Realtime.workspace.member.ReplaceMembersPayload> {
  protected actionCreator = Realtime.workspace.member.replace;

  protected process = Realtime.Utils.functional.noop;
}

export default ReplaceWorkspaceMembers;
