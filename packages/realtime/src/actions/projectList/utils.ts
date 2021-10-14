import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';

import { AbstractActionControl, ActionAccessor, BoundActionAccessor, sanitizePatch } from '@/actions/utils';
import { accessWorkspaces, resendWorkspaceChannels, WorkspaceContextData } from '@/actions/workspace/utils';

// eslint-disable-next-line import/prefer-default-export
export abstract class AbstractProjectListResourceControl<
  P extends Realtime.BaseWorkspacePayload,
  D extends WorkspaceContextData = WorkspaceContextData
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> = accessWorkspaces.bind<BoundActionAccessor<P, D>>(this);

  protected resend = resendWorkspaceChannels;

  protected applyPatch = async (
    ctx: Context,
    workspaceID: string,
    listID: string,
    transform: (data: Realtime.ProjectList) => Partial<Realtime.ProjectList>
  ) => {
    const creatorID = Number(ctx.userId);
    const projectLists = await this.services.projectList.getAll(creatorID, workspaceID);

    const patched = projectLists.map((dbList) => {
      if (dbList.board_id !== listID) return dbList;

      const list = Realtime.Adapters.projectListAdapter.fromDB(dbList);

      return Realtime.Adapters.projectListAdapter.toDB({ ...list, ...sanitizePatch(transform(list)) });
    });

    await this.services.projectList.replaceAll(creatorID, workspaceID, patched);
  };
}
