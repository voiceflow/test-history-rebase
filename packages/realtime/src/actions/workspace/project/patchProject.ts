import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';
import type { Action } from 'typescript-fsa';

import { AbstractResendWorkspaceActionControl } from '../utils';

class PatchProject extends AbstractResendWorkspaceActionControl<
  Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.AnyProject>>
> {
  actionCreator = Realtime.project.crudActions.patch;

  process = async (
    ctx: Context,
    { payload }: Action<Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.AnyProject>>>
  ): Promise<void> => {
    await this.services.project.patch(payload.key, Number(ctx.userId), {
      ..._.pick(payload.value, 'name', 'privacy', 'linkType'),
      ...('image' in payload.value && { image: payload.value.image ?? undefined }),
    });
  };
}

export default PatchProject;
