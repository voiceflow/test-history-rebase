import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractWorkspaceChannelControl } from '../utils';

class ReplaceQuota extends AbstractWorkspaceChannelControl<Realtime.workspace.quotas.replaceQuotaPayload> {
  protected actionCreator = Realtime.workspace.quotas.replaceQuota;

  protected process = Utils.functional.noop;
}

export default ReplaceQuota;
