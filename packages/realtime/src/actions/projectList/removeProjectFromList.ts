import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectListResourceControl } from './utils';

class RemoveProjectFromList extends AbstractProjectListResourceControl<Realtime.projectList.BaseProjectListPayload> {
  protected actionCreator = Realtime.projectList.removeProjectFromList;

  protected process = async (ctx: Context, { payload }: Action<Realtime.projectList.BaseProjectListPayload>) => {
    await Promise.all([
      this.server.processAs(ctx.data.creatorID, Realtime.project.crud.remove({ key: payload.projectID, workspaceID: payload.workspaceID })),
      this.applyPatch(ctx, payload.workspaceID, payload.listID, (list) => ({
        projects: Utils.array.withoutValue(list.projects, payload.projectID),
      })),
    ]);
  };
}

export default RemoveProjectFromList;
