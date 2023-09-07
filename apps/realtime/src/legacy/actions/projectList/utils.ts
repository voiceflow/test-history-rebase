import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ActionAccessor, Context, sanitizePatch } from '@voiceflow/socket-utils';

import { AbstractActionControl } from '@/legacy/actions/utils';
import { accessWorkspaces, resendWorkspaceChannels, WorkspaceContextData } from '@/legacy/actions/workspace/utils';

export abstract class AbstractProjectListResourceControl<
  P extends Realtime.BaseWorkspacePayload,
  D extends WorkspaceContextData = WorkspaceContextData
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> = accessWorkspaces(this);

  protected resend = resendWorkspaceChannels;

  protected applyPatch = async (
    ctx: Context,
    workspaceID: string,
    listID: string,
    transform: (data: Realtime.ProjectList) => Partial<Realtime.ProjectList>
  ) => {
    const { creatorID } = ctx.data;
    const projectLists = await this.services.projectList.getAll(creatorID, workspaceID);

    const patched = projectLists.map((dbList) => {
      if (dbList.board_id !== listID) return dbList;

      const list = Realtime.Adapters.projectListAdapter.fromDB(dbList);

      return Realtime.Adapters.projectListAdapter.toDB({ ...list, ...sanitizePatch(transform(list)) });
    });

    await this.services.projectList.replaceAll(creatorID, workspaceID, patched);
  };
}
