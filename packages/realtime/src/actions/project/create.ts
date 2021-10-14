import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';

import { terminateResend } from '@/actions/utils';

import { AbstractProjectResourceControl } from './utils';

class CreateProject extends AbstractProjectResourceControl<Realtime.project.CreateProjectPayload> {
  protected actionCreator = Realtime.project.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.project.create, async (ctx, { payload }) => {
    const creatorID = Number(ctx.userId);

    const [listID, project] = await Promise.all([
      this.getTargetListID(ctx, payload.workspaceID, payload.listID),
      this.services.project
        .create(creatorID, payload.templateID, payload.channel, _.pick(payload.data, 'name', 'image', 'platform'))
        .then(Realtime.Adapters.projectAdapter.fromDB),
    ]);

    await Promise.all([
      this.server.process(Realtime.project.crud.add({ workspaceID: payload.workspaceID, key: project.id, value: project })),
      this.server.process(Realtime.projectList.addProjectToList({ workspaceID: payload.workspaceID, projectID: project.id, listID })),
    ]);

    return project;
  });
}

export default CreateProject;
