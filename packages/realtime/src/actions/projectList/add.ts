import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

type AddProjectListPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Realtime.ProjectList>;

class AddProjectList extends AbstractWorkspaceChannelControl<AddProjectListPayload> {
  protected actionCreator = Realtime.projectList.crud.add;

  protected process = async (ctx: Context, { payload }: Action<AddProjectListPayload>) => {
    const creatorID = Number(ctx.userId);
    const newProjectList = Realtime.Adapters.projectListAdapter.toDB({ ...payload.value, id: payload.key });
    const projectLists = await this.services.projectList.getAll(creatorID, payload.workspaceID);

    await this.services.projectList.replaceAll(creatorID, payload.workspaceID, [...projectLists, newProjectList]);
  };
}

export default AddProjectList;
