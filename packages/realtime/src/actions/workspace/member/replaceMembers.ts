import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { noAccess } from '@voiceflow/socket-utils';

import { AbstractWorkspaceChannelControl } from '../utils';

class ReplaceWorkspaceMembers extends AbstractWorkspaceChannelControl<Realtime.workspace.member.ReplaceMembersPayload> {
  protected actionCreator = Realtime.workspace.member.replace;

  protected access = noAccess(this);

  protected process = Utils.functional.noop;
}

export default ReplaceWorkspaceMembers;
