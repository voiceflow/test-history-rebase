import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { ActionAccessor, BaseContextData, Context, Resender } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/legacy/actions/utils';

type WorkspacePayload = Realtime.BaseWorkspacePayload | Realtime.workspace.ClientWorkspaceCRUDPayload;

export interface WorkspaceContextData extends BaseContextData {
  workspaceIDs: string[];
}

export const accessWorkspaces = <P extends WorkspacePayload, D extends WorkspaceContextData>(
  self: AbstractActionControl<P, D>
): ActionAccessor<P, D> =>
  async function (
    this: AbstractActionControl<P, D>,
    ctx: Context<WorkspaceContextData>,
    action: Action<WorkspacePayload>
  ): Promise<boolean> {
    const workspaceIDs = Realtime.workspace.getTargetedWorkspaces(action);
    if (!workspaceIDs) return false;

    ctx.data.workspaceIDs = workspaceIDs;

    const { creatorID } = ctx.data;

    return (
      await Promise.all(
        workspaceIDs.map((workspaceID) => self.services.workspace.access.canRead(creatorID, workspaceID))
      )
    ).every(Boolean);
    // eslint-disable-next-line no-extra-bind
  }.bind(self);

export const resendWorkspaceChannels: Resender<WorkspacePayload, WorkspaceContextData> = (ctx, { payload }) => {
  let { workspaceIDs } = ctx.data;

  // FIXME: special case to handle actions sent by the server that will not pass through the accessor
  if (!workspaceIDs) {
    const { workspaceID = null } = (payload as any) ?? {};

    if (!workspaceID) return {};

    workspaceIDs = [workspaceID];
  }

  return {
    channels: workspaceIDs.map((workspaceID) => Realtime.Channels.workspace.build({ workspaceID })),
  };
};

export abstract class AbstractWorkspaceChannelControl<
  P extends WorkspacePayload,
  D extends WorkspaceContextData = WorkspaceContextData,
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> = accessWorkspaces(this);

  protected resend: Resender<P, D> = resendWorkspaceChannels;
}
