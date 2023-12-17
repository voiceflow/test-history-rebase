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

    const fields = Utils.object.pick(payload.value, ['name', 'privacy', 'linkType', 'customThemes', 'apiPrivacy']);
    const { nluSettings, aiAssistSettings, image } = payload.value;

    await this.services.requestContext.createAsync(() =>
      this.services.projectV2.patchOne(payload.key, {
        ...fields,
        ...(image && { image }),
        // this spread pattern is somehow needed to satisfy the type checker
        ...(nluSettings && { nluSettings: { ...nluSettings } }),
        ...(aiAssistSettings && { aiAssistSettings: { ...aiAssistSettings } }),
        updatedBy: ctx.data.creatorID,
        updatedAt: new Date().toJSON(),
      })
    );
  };
}

export default PatchProject;
