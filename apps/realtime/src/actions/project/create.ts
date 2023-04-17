import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractProjectResourceControl } from './utils';

class CreateProject extends AbstractProjectResourceControl<Realtime.project.CreateProjectPayload> {
  protected actionCreator = Realtime.project.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.project.create, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

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

    const project = Realtime.Adapters.projectAdapter.fromDB(dbProject, { members });

    await Promise.all([
      this.server.processAs(
        creatorID,
        Realtime.project.crud.add({
          key: project.id,
          // TODO: replace with `value: project` when clients are migrated to v1.1.1
          value: this.isGESubprotocol(ctx, Realtime.Subprotocol.Version.V1_1_1) ? project : ({ ...project, members: dbProject.members } as any),
          workspaceID: payload.workspaceID,
        })
      ),
      this.server.processAs(creatorID, Realtime.projectList.addProjectToList({ workspaceID: payload.workspaceID, projectID: project.id, listID })),
    ]);

    return project;
  });
}

export default CreateProject;
