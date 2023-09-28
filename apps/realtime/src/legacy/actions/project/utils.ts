/* eslint-disable max-classes-per-file */
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { ActionAccessor, Context, Resender } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractActionControl } from '@/legacy/actions/utils';
import { accessWorkspaces, resendWorkspaceChannels, WorkspaceContextData } from '@/legacy/actions/workspace/utils';

export const accessProject = <P extends Realtime.BaseProjectPayload, D extends WorkspaceContextData>(
  self: AbstractActionControl<P, D>
): ActionAccessor<P, D> =>
  async function (this: AbstractActionControl<P, D>, ctx: Context<D>, action: Action<P>): Promise<boolean> {
    const { creatorID } = ctx.data;

    ctx.data.workspaceIDs = [action.payload.workspaceID];

    return (
      await Promise.all([
        this.services.workspace.access.canRead(creatorID, action.payload.workspaceID),
        this.services.project.access.canRead(creatorID, action.payload.projectID),
      ])
    ).every(Boolean);
  }.bind(self);

export const resendProjectChannel: Resender<Realtime.BaseProjectPayload, any> = (_, { payload: { projectID, workspaceID } }) => ({
  channel: Realtime.Channels.project.build({ projectID, workspaceID }),
});

export abstract class AbstractProjectChannelControl<
  P extends Realtime.BaseProjectPayload,
  D extends WorkspaceContextData = WorkspaceContextData
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> = accessProject(this);

  protected resend = resendProjectChannel;
}

export abstract class AbstractProjectResourceControl<
  P extends Realtime.BaseWorkspacePayload,
  D extends WorkspaceContextData = WorkspaceContextData
> extends AbstractActionControl<P, D> {
  protected access: ActionAccessor<P, D> = accessWorkspaces(this);

  protected resend = resendWorkspaceChannels;

  protected getTargetListID = async (ctx: Context, workspaceID: string, overrideListID?: string): Promise<string> => {
    const { creatorID, clientID } = ctx.data;
    let listID = overrideListID;

    // check for an existing default list
    if (!listID) {
      const defaultList = await this.services.projectList.getDefault(creatorID, workspaceID);

      listID = defaultList?.board_id;
    }

    // create a new default list
    if (!listID) {
      listID = Utils.id.cuid();
      await this.server.processAs(
        creatorID,
        clientID,
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
