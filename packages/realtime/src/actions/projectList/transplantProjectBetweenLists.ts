import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class TransplantProjectBetweenLists extends AbstractWorkspaceChannelControl<Realtime.projectList.TransplantProjectBetweenListsPayload> {
  protected actionCreator = Realtime.projectList.transplantProjectBetweenLists;

  protected process = async (ctx: Context, { payload }: Action<Realtime.projectList.TransplantProjectBetweenListsPayload>) => {
    const { creatorID } = ctx.data;
    const { projectID } = payload.from;
    const isReorder = payload.from.listID === payload.to.listID;

    const lists = await this.services.projectList.getAll(creatorID, payload.workspaceID);

    const getTargetIndex = (list: Realtime.DBProjectList) =>
      typeof payload.to.target === 'number' ? payload.to.target : list.projects.indexOf(payload.to.target);

    const updatedLists = lists.map((list) => {
      if (list.board_id === payload.from.listID) {
        return {
          ...list,
          projects: isReorder
            ? Utils.array.reorder(list.projects, list.projects.indexOf(projectID), getTargetIndex(list))
            : Utils.array.withoutValue(list.projects, projectID),
        };
      }

      if (list.board_id === payload.to.listID) {
        return {
          ...list,
          projects: Utils.array.insert(list.projects, getTargetIndex(list), projectID),
        };
      }

      return list;
    });

    await this.services.projectList.replaceAll(creatorID, payload.workspaceID, updatedLists);
  };
}

export default TransplantProjectBetweenLists;
