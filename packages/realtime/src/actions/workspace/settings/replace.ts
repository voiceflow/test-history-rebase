import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { noAccess } from '@voiceflow/socket-utils';

import { AbstractWorkspaceChannelControl } from '../utils';

class ReplaceWorkspaceSettings extends AbstractWorkspaceChannelControl<Realtime.workspace.settings.ReplaceWorkspaceSettingsPayload> {
  protected actionCreator = Realtime.workspace.settings.replace;

  protected access = noAccess(this);

  protected process = Utils.functional.noop;
}

export default ReplaceWorkspaceSettings;
