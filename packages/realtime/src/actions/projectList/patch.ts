import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';
import { Action } from 'typescript-fsa';

import { Context } from '@/types';

import { AbstractProjectListResourceControl } from './utils';

type PatchProjectListPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.ProjectList>>;

class PatchProjectList extends AbstractProjectListResourceControl<PatchProjectListPayload> {
  protected actionCreator = Realtime.projectList.crud.patch;

  protected process = async (ctx: Context, { payload }: Action<PatchProjectListPayload>) => {
    await this.applyPatch(ctx, payload.workspaceID, payload.key, () => _.pick(payload.value, 'name', 'projects'));
  };
}

export default PatchProjectList;
