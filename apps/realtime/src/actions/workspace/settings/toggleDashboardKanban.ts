import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import _ from 'lodash';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '../utils';

class ToggleDashboardKanban extends AbstractWorkspaceChannelControl<Realtime.workspace.settings.ToggleDashboardKanbanPayload> {
  protected actionCreator = Realtime.workspace.settings.toggleDashboardKanban;

  protected resend = terminateResend;

  protected process = async (ctx: Context, { payload }: Action<Realtime.workspace.settings.ToggleDashboardKanbanPayload>) => {
    const { creatorID } = ctx.data;

    await this.services.workspaceSettings.patch(creatorID, payload.workspaceID, { dashboardKanban: payload.enabled });
  };
}

export default ToggleDashboardKanban;
