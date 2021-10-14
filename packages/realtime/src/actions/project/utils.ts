/* eslint-disable max-classes-per-file, @typescript-eslint/ban-types */
import type { Context } from '@logux/server';
import { Eventual } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import cuid from 'cuid';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl, ActionAccessor, BoundActionAccessor, Resender } from '@/actions/utils';
import { accessWorkspaces, resendWorkspaceChannels, WorkspaceContextData } from '@/actions/workspace/utils';

export async function accessProject<C extends AbstractActionControl<P, D>, P extends Realtime.BaseProjectPayload, D extends object = {}>(
  this: C,
  ctx: Context<D>,
  action: Action<P>
): Promise<boolean> {
  const creatorID = Number(ctx.userId);

  return (
    await Promise.all([
      this.services.workspace.canRead(creatorID, action.payload.workspaceID),
      this.services.project.canRead(creatorID, action.payload.projectID),
    ])
  ).every(Boolean);
}

export const resendProjectChannel: Resender<Realtime.BaseProjectPayload, any> = (_, { payload: { projectID, workspaceID } }) => ({
  channel: Realtime.Channels.project.build({ projectID, workspaceID }),
});

export abstract class AbstractProjectChannelControl<P extends Realtime.BaseProjectPayload, D extends object = {}> extends AbstractActionControl<
  P,
  D
> {
  protected access: ActionAccessor<P, D> = accessProject.bind<BoundActionAccessor<P, D>>(this);

  protected resend = resendProjectChannel;
}

export abstract class AbstractProjectResourceControl<
  P extends Realtime.BaseWorkspacePayload,
  D extends WorkspaceContextData = WorkspaceContextData
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> =
    accessWorkspaces.bind<(this: AbstractActionControl<P, D>, ctx: Context<D>, action: Action<P>) => Eventual<boolean>>(this);

  protected resend = resendWorkspaceChannels;

  protected getTargetListID = async (ctx: Context, workspaceID: string, overrideListID?: string): Promise<string> => {
    const creatorID = Number(ctx.userId);
    let listID = overrideListID;

    // check for an existing default list
    if (!listID) {
      const defaultList = await this.services.projectList.getDefault(creatorID, workspaceID);

      listID = defaultList?.board_id;
    }

    // create a new default list
    if (!listID) {
      listID = cuid();
      await this.server.process(
        Realtime.projectList.crud.add({
          key: listID,
          value: { id: listID, name: Realtime.DEFAULT_PROJECT_LIST_NAME, projects: [] },
          workspaceID,
        })
      );
    }

    return listID;
  };
}
