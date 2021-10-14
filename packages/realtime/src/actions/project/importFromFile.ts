import * as Realtime from '@voiceflow/realtime-sdk';

import { terminateResend } from '@/actions/utils';

import { AbstractProjectResourceControl } from './utils';

class ImportProjectFromFile extends AbstractProjectResourceControl<Realtime.project.ImportProjectFromFilePayload> {
  protected actionCreator = Realtime.project.importFromFile.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.project.importFromFile, async (ctx, { payload }) => {
    const [listID, project] = await Promise.all([
      this.getTargetListID(ctx, payload.workspaceID),
      this.services.project.importFromFile(Number(ctx.userId), payload.workspaceID, payload.data).then(Realtime.Adapters.projectAdapter.fromDB),
    ]);

    await Promise.all([
      this.server.process(Realtime.project.crud.add({ key: project.id, value: project, workspaceID: payload.workspaceID })),
      this.server.process(Realtime.projectList.addProjectToList({ projectID: project.id, listID, workspaceID: payload.workspaceID })),
    ]);

    return project;
  });
}

export default ImportProjectFromFile;
