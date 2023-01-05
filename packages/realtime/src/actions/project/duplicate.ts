import { ServerMeta } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import _ from 'lodash';
import type { Action } from 'typescript-fsa';

import { accessWorkspaces, WorkspaceContextData } from '@/actions/workspace/utils';

import { AbstractProjectResourceControl } from './utils';

class DuplicateProject extends AbstractProjectResourceControl<Realtime.project.DuplicateProjectPayload> {
  protected actionCreator = Realtime.project.duplicate.started;

  protected access = async (
    ctx: Context<WorkspaceContextData>,
    action: Action<Realtime.project.DuplicateProjectPayload>,
    meta: ServerMeta
  ): Promise<boolean> => {
    if (!(await accessWorkspaces(this)(ctx, action, meta))) return false;

    return this.services.workspace.access.canRead(ctx.data.creatorID, action.payload.data.teamID);
  };

  protected resend = terminateResend;

  protected process = this.reply(Realtime.project.duplicate, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const targetWorkspaceID = payload.data.teamID;

    const [listID, project] = await Promise.all([
      this.getTargetListID(ctx, targetWorkspaceID, payload.listID),
      this.services.project
        .duplicate(creatorID, payload.projectID, _.pick(payload.data, 'name', 'teamID', '_version', 'platform'))
        .then(Realtime.Adapters.projectAdapter.fromDB),
    ]);

    await Promise.all([
      this.server.processAs(creatorID, Realtime.project.crud.add({ workspaceID: targetWorkspaceID, key: project.id, value: project })),
      this.server.processAs(creatorID, Realtime.projectList.addProjectToList({ workspaceID: targetWorkspaceID, projectID: project.id, listID })),
    ]);

    return project;
  });
}

export default DuplicateProject;
