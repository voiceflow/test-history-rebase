import type { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import _ from 'lodash';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

type PatchProjectPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.AnyProject>>;

class PatchProject extends AbstractWorkspaceChannelControl<PatchProjectPayload> {
  protected actionCreator = Realtime.project.crud.patch;

  protected process = async (ctx: Context, { payload }: Action<PatchProjectPayload>): Promise<void> => {
    await this.services.project.patch(Number(ctx.userId), payload.key, {
      ..._.pick(payload.value, 'name', 'privacy', 'linkType'),
      ...('image' in payload.value && { image: payload.value.image ?? undefined }),
    });
  };
}

export default PatchProject;
