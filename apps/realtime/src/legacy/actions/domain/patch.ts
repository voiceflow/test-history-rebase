import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { Context } from '@voiceflow/socket-utils';
import type { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

interface Payload
  extends Realtime.BaseVersionPayload,
    Realtime.actionUtils.CRUDValuePayload<Realtime.domain.PatchPayload> {}

class PatchDomain extends AbstractDomainResourceControl<Payload> {
  protected actionCreator = Realtime.domain.crud.patch;

  protected process = async (ctx: Context, { payload }: Action<Payload>) => {
    const { creatorID } = ctx.data;
    const { key, value, versionID } = payload;

    await this.services.domain.patch(versionID, key, {
      ...value,
      updatedAt: value.updatedAt ?? new Date().toJSON(),
      updatedBy: value.updatedBy ?? creatorID,
    });
  };

  protected finally = async (ctx: Context, { payload }: Action<Payload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default PatchDomain;
