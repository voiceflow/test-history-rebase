import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/legacy/actions/workspace/utils';

type MoveProjectListPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDMovePayload;

class MoveProjectList extends AbstractWorkspaceChannelControl<MoveProjectListPayload> {
  protected actionCreator = Realtime.projectList.crud.move;

  protected process = async (ctx: Context, { payload, meta }: Action<MoveProjectListPayload>) => {
    if (meta?.skipPersist) return;

    const { creatorID } = ctx.data;

    const projectLists = await this.services.projectList.getAll(creatorID, payload.workspaceID);

    const fromIndex = projectLists.findIndex((list) => list.board_id === payload.fromID);

    if (payload.toIndex === fromIndex) return;

    await this.services.projectList.replaceAll(creatorID, payload.workspaceID, Utils.array.reorder(projectLists, fromIndex, payload.toIndex));
  };
}

export default MoveProjectList;
