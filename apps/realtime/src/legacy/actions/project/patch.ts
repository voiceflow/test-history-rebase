import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractWorkspaceChannelControl } from '@/legacy/actions/workspace/utils';

type PatchProjectPayload = Realtime.BaseWorkspacePayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.AnyProject>>;

class PatchProject extends AbstractWorkspaceChannelControl<PatchProjectPayload> {
  protected actionCreator = Realtime.project.crud.patch;

  protected process = async (ctx: Context, { payload, meta }: Action<PatchProjectPayload>): Promise<void> => {
    if (meta?.skipPersist) return;

    await this.services.project.patch(ctx.data.creatorID, payload.key, {
      ...Utils.object.pick(payload.value, ['name', 'privacy', 'linkType', 'customThemes', 'apiPrivacy', 'aiAssistSettings']),
      ...('image' in payload.value && { image: payload.value.image ?? undefined }),
      updatedAt: new Date().toJSON(),
      updatedBy: ctx.data.creatorID,
    });
  };
}

export default PatchProject;
