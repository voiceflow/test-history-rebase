import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { noAccess } from '@voiceflow/socket-utils';

import { AbstractWorkspaceChannelControl } from '../utils';

class LoadAllQuota extends AbstractWorkspaceChannelControl<Realtime.workspace.quotas.LoadQuotasPayload> {
  protected actionCreator = Realtime.workspace.quotas.loadAll;

  protected access = noAccess(this);

  protected process = Utils.functional.noop;
}

export default LoadAllQuota;
