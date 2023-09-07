import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class TransplantProjectBetweenLists extends AbstractWorkspaceChannelControl<Realtime.projectList.TransplantProjectBetweenListsPayload> {
  protected actionCreator = Realtime.projectList.transplantProjectBetweenLists;

  protected process = async (ctx: Context, { payload, meta }: Action<Realtime.projectList.TransplantProjectBetweenListsPayload>) => {
    if (meta?.skipPersist) return;

    const { creatorID } = ctx.data;
    const { index: toIndex, listID: toListID } = payload.to;
    const { projectID: fromProjectID, listID: fromListID } = payload.from;
    const isReorder = fromListID === toListID;

    const lists = await this.services.projectList.getAll(creatorID, payload.workspaceID);

    const updatedLists = lists.map((list) => {
      if (list.board_id === fromListID) {
        const fromProjectIndex = list.projects.indexOf(fromProjectID);

        return {
          ...list,
          projects: isReorder
            ? Utils.array.reorder(list.projects, fromProjectIndex, toIndex)
            : Utils.array.withoutValue(list.projects, fromProjectID),
        };
      }

      if (!isReorder && list.board_id === toListID) {
        return {
          ...list,
          projects: Utils.array.insert(list.projects, toIndex, fromProjectID),
        };
      }

      return list;
    });

    await this.services.projectList.replaceAll(creatorID, payload.workspaceID, updatedLists);
  };
}

export default TransplantProjectBetweenLists;
