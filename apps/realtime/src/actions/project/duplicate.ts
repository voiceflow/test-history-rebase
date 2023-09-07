import { ServerMeta } from '@logux/server';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, terminateResend } from '@voiceflow/socket-utils';
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

    const [listID, dbProject] = await Promise.all([
      this.getTargetListID(ctx, targetWorkspaceID, payload.listID),
      this.services.project.duplicate(creatorID, payload.projectID, Utils.object.pick(payload.data, ['name', 'teamID', '_version', 'platform'])),
    ]);

    const project = Realtime.Adapters.projectAdapter.fromDB(dbProject, { members: [] });

    await Promise.all([
      this.server.processAs(
        creatorID,
        Realtime.project.crud.add({
          key: project.id,
          value: project,
          workspaceID: payload.workspaceID,
        })
      ),
      this.server.processAs(creatorID, Realtime.projectList.addProjectToList({ workspaceID: targetWorkspaceID, projectID: project.id, listID })),
    ]);

    return project;
  });
}

export default DuplicateProject;
