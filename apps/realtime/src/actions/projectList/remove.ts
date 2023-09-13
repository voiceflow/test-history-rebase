import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

type RemoveProjectListPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveProjectList extends AbstractWorkspaceChannelControl<RemoveProjectListPayload> {
  protected actionCreator = Realtime.projectList.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveProjectListPayload>) => {
    const { creatorID } = ctx.data;
    const projectLists = await this.services.projectList.getAll(creatorID, payload.workspaceID);

    const targetProjectList = projectLists.find((list) => list.board_id === payload.key);

    if (!targetProjectList) return;

    await Promise.all([
      this.server.processAs(creatorID, Realtime.project.crud.removeMany({ keys: targetProjectList.projects, workspaceID: payload.workspaceID })),
      this.services.projectList.replaceAll(creatorID, payload.workspaceID, Utils.array.withoutValue(projectLists, targetProjectList)),
    ]);
  };
}

export default RemoveProjectList;
