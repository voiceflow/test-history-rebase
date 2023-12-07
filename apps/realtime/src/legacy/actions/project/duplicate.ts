import { ServerMeta } from '@logux/server';
import { Utils } from '@voiceflow/common';
import type { Assistant } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { accessWorkspaces, WorkspaceContextData } from '@/legacy/actions/workspace/utils';

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
    const { creatorID, clientID } = ctx.data;
    const targetWorkspaceID = payload.data.teamID;

    const [listID, dbProject] = await Promise.all([
      this.getTargetListID(ctx, targetWorkspaceID, payload.listID),
      this.services.project.duplicate(creatorID, payload.projectID, Utils.object.pick(payload.data, ['name', 'teamID', '_version', 'platform'])),
    ]);

    const project = Realtime.Adapters.projectAdapter.fromDB(dbProject, { members: [] });

    let assistant: Assistant | null = null;
    if (this.services.feature.isEnabled(Realtime.FeatureFlag.V2_CMS, { userID: creatorID, workspaceID: payload.workspaceID })) {
      const activeEnvironmentID = dbProject.devVersion;

      if (!activeEnvironmentID) {
        throw new Error('devVersion is missing');
      }

      assistant = await this.services.requestContext.createAsync(() =>
        this.services.assistant.createOneForLegacyProject(dbProject.teamID, dbProject._id, {
          name: dbProject.name,
          updatedByID: creatorID,
          activePersonaID: null,
          activeEnvironmentID,
        })
      );
    }

    await Promise.all([
      ...(assistant
        ? [this.server.processAs(creatorID, clientID, Actions.Assistant.AddOne({ data: assistant, context: { workspaceID: dbProject.teamID } }))]
        : []),

      this.server.processAs(
        creatorID,
        clientID,
        Realtime.project.crud.add({
          key: project.id,
          value: project,
          workspaceID: payload.workspaceID,
        })
      ),
      this.server.processAs(
        creatorID,
        clientID,
        Realtime.projectList.addProjectToList({ workspaceID: targetWorkspaceID, projectID: project.id, listID })
      ),
    ]);

    return project;
  });
}

export default DuplicateProject;
