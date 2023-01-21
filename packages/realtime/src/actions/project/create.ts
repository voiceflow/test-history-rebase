import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend } from '@voiceflow/socket-utils';
import _ from 'lodash';

import { AbstractProjectResourceControl } from './utils';

class CreateProject extends AbstractProjectResourceControl<Realtime.project.CreateProjectPayload> {
  protected actionCreator = Realtime.project.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.project.create, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    const [listID, dbProject] = await Promise.all([
      this.getTargetListID(ctx, payload.workspaceID, payload.listID),
      this.services.project.create(
        creatorID,
        payload.templateID,
        { ..._.pick(payload.data, 'name', 'image', '_version'), teamID: payload.workspaceID },
        { modality: payload.modality, channel: payload.channel, language: payload.language, onboarding: payload.onboarding }
      ),
    ]);

    const project = Realtime.Adapters.projectAdapter.fromDB(dbProject);

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
