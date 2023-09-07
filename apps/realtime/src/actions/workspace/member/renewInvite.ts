import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractWorkspaceChannelControl } from '../utils';

class RenewWorkspaceInvite extends AbstractWorkspaceChannelControl<Realtime.workspace.member.RenewInvitePayload> {
  protected actionCreator = Realtime.workspace.member.renewInvite;

  protected process = Utils.functional.noop;
}

export default RenewWorkspaceInvite;
