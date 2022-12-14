import * as Realtime from '@voiceflow/realtime-sdk';
import { terminateResend } from '@voiceflow/socket-utils';
import _ from 'lodash';

import { AbstractProjectResourceControl } from './utils';

class CreateProject extends AbstractProjectResourceControl<Realtime.project.CreateProjectPayload> {
  protected actionCreator = Realtime.project.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.project.create, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;

    const [listID, project] = await Promise.all([
      this.getTargetListID(ctx, payload.workspaceID, payload.listID),
      this.services.project
        .create(
          creatorID,
          payload.templateID,
          { ..._.pick(payload.data, 'name', 'image', '_version'), teamID: payload.workspaceID },
          { modality: payload.modality, channel: payload.channel, language: payload.language, onboarding: payload.onboarding }
        )
        .then(Realtime.Adapters.projectAdapter.fromDB),
    ]);

    await Promise.all([
      this.server.processAs(creatorID, Realtime.project.crud.add({ workspaceID: payload.workspaceID, key: project.id, value: project })),
      this.server.processAs(creatorID, Realtime.projectList.addProjectToList({ workspaceID: payload.workspaceID, projectID: project.id, listID })),
    ]);

    return project;
  });
}

export default CreateProject;
