import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import _ from 'lodash';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/actions/workspace/utils';

type PatchProjectPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.AnyProject>>;

class PatchProject extends AbstractWorkspaceChannelControl<PatchProjectPayload> {
  protected actionCreator = Realtime.project.crud.patch;

  protected process = async (ctx: Context, { payload, meta }: Action<PatchProjectPayload>): Promise<void> => {
    if (meta?.skipPersist) return;

    await this.services.project.patch(ctx.data.creatorID, payload.key, {
      ..._.pick(payload.value, 'name', 'privacy', 'linkType', 'customThemes', 'apiPrivacy'),
      ...('image' in payload.value && { image: payload.value.image ?? undefined }),
    });
  };
}

export default PatchProject;
