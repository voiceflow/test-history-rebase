import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

class TransplantProjectBetweenLists extends AbstractWorkspaceChannelControl<Realtime.projectList.TransplantProjectBetweenListsPayload> {
  protected actionCreator = Realtime.projectList.transplantProjectBetweenLists;

  // eslint-disable-next-line sonarjs/cognitive-complexity
  protected process = async (ctx: Context, { payload, meta }: Action<Realtime.projectList.TransplantProjectBetweenListsPayload>) => {
    if (meta?.skipPersist) return;

    const { creatorID } = ctx.data;
    const { index: toIndex, listID: toListID } = payload.to;
    const { projectID: fromProjectID, listID: fromListID } = payload.from;
    const isReorder = fromListID === toListID;

    const lists = await this.services.projectList.getAll(creatorID, payload.workspaceID);

    const isSubprotocol1_2Plus = this.isGESubprotocol(ctx, Realtime.Subprotocol.Version.V1_2_0);

    const getTargetIndex = (list: Realtime.DBProjectList) =>
      typeof (payload.to as any).target === 'number' ? (payload.to as any).target : list.projects.indexOf((payload.to as any).target);

    const updatedLists = lists.map((list) => {
      if (list.board_id === fromListID) {
        const toProjectIndex = isSubprotocol1_2Plus ? toIndex : getTargetIndex(list);
        const fromProjectIndex = list.projects.indexOf(fromProjectID);

        return {
          ...list,
          projects: isReorder
            ? Utils.array.reorder(list.projects, fromProjectIndex, toProjectIndex)
            : Utils.array.withoutValue(list.projects, fromProjectID),
        };
      }

      if (!isReorder && list.board_id === toListID) {
        const insertIndex = isSubprotocol1_2Plus ? toIndex : getTargetIndex(list);

        return {
          ...list,
          projects: Utils.array.insert(list.projects, insertIndex, fromProjectID),
        };
      }

      return list;
    });

    await this.services.projectList.replaceAll(creatorID, payload.workspaceID, updatedLists);
  };
}

export default TransplantProjectBetweenLists;
