import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractProjectResourceControl } from './utils';

class CreateProject extends AbstractProjectResourceControl<Realtime.project.CreateProjectPayload> {
  protected actionCreator = Realtime.project.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.project.create, async (ctx, { payload }) => {
    const { creatorID, clientID } = ctx.data;

    const [listID, dbProject] = await Promise.all([
      this.getTargetListID(ctx, payload.workspaceID, payload.listID),
      this.services.project.create(creatorID, payload.templateID, {
        ...Utils.object.pick(payload.data, ['name', 'image', '_version']),
        teamID: payload.workspaceID,
      }),
    ]);

    let members: Realtime.ProjectMember[] = [];

    try {
      if (payload.members?.length) {
        await this.services.project.member.addMany(creatorID, dbProject._id, payload.members);

        members = payload.members;
      }
    } catch {
      // the add members call is not critical, so we can ignore any errors
      // usually this happens when the editor seats limit is reached
    }

    const { devVersion } = dbProject;

    if (!devVersion) {
      throw new Error('devVersion is missing');
    }

    const assistant = await this.services.requestContext.create(() =>
      this.services.assistant.createOneForLegacyProject(dbProject.teamID, dbProject._id, {
        name: dbProject.name,
        updatedByID: creatorID,
        activeEnvironmentID: devVersion,
      })
    );

    const project = Realtime.Adapters.projectAdapter.fromDB(dbProject, { members });

    await Promise.all([
      ...(assistant
        ? [
            this.server.processAs(
              creatorID,
              clientID,
              Actions.Assistant.AddOne({ data: assistant, context: { workspaceID: dbProject.teamID } })
            ),
          ]
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
        Realtime.projectList.addProjectToList({ workspaceID: payload.workspaceID, projectID: project.id, listID })
      ),
    ]);

    return project;
  });
}

export default CreateProject;
