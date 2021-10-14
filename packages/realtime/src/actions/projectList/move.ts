import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

type MoveProjectListPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDMovePayload;

class MoveProjectList extends AbstractWorkspaceChannelControl<MoveProjectListPayload> {
  protected actionCreator = Realtime.projectList.crud.move;

  protected process = async (ctx: Context, { payload }: Action<MoveProjectListPayload>) => {
    const creatorID = Number(ctx.userId);
    const projectLists = await this.services.projectList.getAll(creatorID, payload.workspaceID);
    const fromIndex = projectLists.findIndex((list) => list.board_id === payload.from);
    const toIndex = projectLists.findIndex((list) => list.board_id === payload.to);

    await this.services.projectList.replaceAll(creatorID, payload.workspaceID, Realtime.Utils.array.reorder(projectLists, fromIndex, toIndex));
  };
}

export default MoveProjectList;
