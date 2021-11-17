import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { noAccess } from '@voiceflow/socket-utils';

import { AbstractWorkspaceChannelControl } from '../utils';

class AddWorkspaceMember extends AbstractWorkspaceChannelControl<Realtime.workspace.member.AddMemberPayload> {
  protected actionCreator = Realtime.workspace.member.add;

  protected access = noAccess(this);

  protected process = Utils.functional.noop;
}

export default AddWorkspaceMember;
