import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';
import { Context } from '@/types';

class TransplantProjectBetweenLists extends AbstractWorkspaceChannelControl<Realtime.projectList.TransplantProjectBetweenListsPayload> {
  protected actionCreator = Realtime.projectList.transplantProjectBetweenLists;

  protected process = async (ctx: Context, { payload }: Action<Realtime.projectList.TransplantProjectBetweenListsPayload>) => {
    const { creatorID } = ctx.data;
    const { projectID } = payload.from;
    const lists = await this.services.projectList.getAll(creatorID, payload.workspaceID);
    const isReorder = payload.from.listID === payload.to.listID;
    const getTargetIndex = (list: Realtime.DBProjectList) =>
      typeof payload.to.target === 'number' ? payload.to.target : list.projects.indexOf(payload.to.target);

    const updatedLists = lists.map((list) => {
      if (list.board_id === payload.from.listID) {
        return {
          ...list,
          projects: isReorder
            ? Realtime.Utils.array.reorder(list.projects, list.projects.indexOf(projectID), getTargetIndex(list))
            : Realtime.Utils.array.withoutValue(list.projects, projectID),
        };
      }

      if (list.board_id === payload.to.listID) {
        return {
          ...list,
          projects: Realtime.Utils.array.insert(list.projects, getTargetIndex(list), projectID),
        };
      }

      return list;
    });

    await this.services.projectList.replaceAll(creatorID, payload.workspaceID, updatedLists);
  };
}

export default TransplantProjectBetweenLists;
