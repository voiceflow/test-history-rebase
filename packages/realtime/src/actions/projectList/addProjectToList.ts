import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractProjectListResourceControl } from './utils';

class AddProjectToList extends AbstractProjectListResourceControl<Realtime.projectList.AddProjectToListPayload> {
  protected actionCreator = Realtime.projectList.addProjectToList;

  protected process = async (ctx: Context, { payload }: Action<Realtime.projectList.AddProjectToListPayload>) => {
    await this.applyPatch(ctx, payload.workspaceID, payload.listID, (list) => ({
      projects: Utils.array.append(list.projects, payload.projectID),
    }));
  };
}

export default AddProjectToList;
