import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class PatchWorkspaceSettings extends AbstractWorkspaceChannelControl<Realtime.workspace.settings.PatchWorkspaceSettingsPayload> {
  protected actionCreator = Realtime.workspace.settings.patch;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.settings.PatchWorkspaceSettingsPayload>) => {
    const { creatorID } = ctx.data;

    await this.services.workspaceSettings.patch(creatorID, payload.workspaceID, payload.settings);
  };
}

export default PatchWorkspaceSettings;
