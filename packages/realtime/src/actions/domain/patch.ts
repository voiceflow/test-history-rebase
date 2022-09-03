import * as Realtime from '@voiceflow/realtime-sdk';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractDomainResourceControl } from './utils';

interface Payload extends Realtime.BaseVersionPayload, Realtime.actionUtils.CRUDValuePayload<Realtime.domain.PatchPayload> {}

class PatchDomain extends AbstractDomainResourceControl<Payload> {
  protected actionCreator = Realtime.domain.crud.patch;

  protected process = async (ctx: Context, { payload }: Action<Payload>) => {
    const { creatorID } = ctx.data;
    const { key, value, versionID } = payload;

    await this.services.domain.patch(creatorID, versionID, key, value);
  };
}

export default PatchDomain;
