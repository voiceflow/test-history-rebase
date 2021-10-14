import type { Context } from '@logux/server';
import { Eventual } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl, ActionAccessor, Resender } from '@/actions/utils';

type WorkspacePayload = Realtime.BaseWorkspacePayload | Realtime.workspace.ClientWorkspaceCRUDPayload;

export interface WorkspaceContextData {
  workspaceIDs: string[];
}

export async function accessWorkspaces<C extends AbstractActionControl<P, D>, P extends WorkspacePayload, D extends WorkspaceContextData>(
  this: C,
  ctx: Context<D>,
  action: Action<P>
): Promise<boolean> {
  const workspaceIDs = Realtime.workspace.getTargetedWorkspaces(action);
  if (!workspaceIDs) return false;

  ctx.data.workspaceIDs = workspaceIDs;

  const creatorID = Number(ctx.userId);

  return (await Promise.all(workspaceIDs.map((workspaceID) => this.services.workspace.canRead(creatorID, workspaceID)))).every(Boolean);
}

export const resendWorkspaceChannels: Resender<WorkspacePayload, WorkspaceContextData> = (ctx) => ({
  channels: ctx.data.workspaceIDs.map((workspaceID) => Realtime.Channels.workspace.build({ workspaceID })),
});

export abstract class AbstractWorkspaceChannelControl<
  P extends WorkspacePayload,
  D extends WorkspaceContextData = WorkspaceContextData
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> =
    accessWorkspaces.bind<(this: AbstractActionControl<P, D>, ctx: Context<D>, action: Action<P>) => Eventual<boolean>>(this);

  protected resend: Resender<P, D> = resendWorkspaceChannels;
}
