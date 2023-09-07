import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractProjectResourceControl } from './utils';

class ImportProject extends AbstractProjectResourceControl<Realtime.project.ImportProjectPayload> {
  protected actionCreator = Realtime.project.importProject;

  protected process = async (ctx: Context, { payload: { project, workspaceID } }: Action<Realtime.project.ImportProjectPayload>) => {
    const { creatorID } = ctx.data;
    const listID = await this.getTargetListID(ctx, workspaceID);

    await Promise.all([
      this.server.processAs(creatorID, Realtime.project.crud.add({ key: project.id, value: project, workspaceID })),
      this.server.processAs(creatorID, Realtime.projectList.addProjectToList({ projectID: project.id, listID, workspaceID })),
    ]);
  };
}

export default ImportProject;
