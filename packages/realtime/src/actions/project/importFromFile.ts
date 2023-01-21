import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { terminateResend } from '@voiceflow/socket-utils';

import { AbstractProjectResourceControl } from './utils';

class ImportProjectFromFile extends AbstractProjectResourceControl<Realtime.project.ImportProjectFromFilePayload> {
  protected actionCreator = Realtime.project.importFromFile.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.project.importFromFile, async (ctx, { payload }) => {
    const { creatorID } = ctx.data;
    const [listID, dbProject] = await Promise.all([
      this.getTargetListID(ctx, payload.workspaceID),
      this.services.project.importFromFile(creatorID, payload.workspaceID, { data: payload.data, vfVersion: payload.vfVersion }),
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
      this.server.processAs(creatorID, Realtime.projectList.addProjectToList({ projectID: project.id, listID, workspaceID: payload.workspaceID })),
    ]);

    return project;
  });
}

export default ImportProjectFromFile;
