import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type RemoveProductPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveProduct extends AbstractVersionResourceControl<RemoveProductPayload> {
  protected actionCreator = Realtime.product.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveProductPayload>) => {
    await this.services.product.delete(Number(ctx.userId), payload.projectID, payload.key);
  };
}

export default RemoveProduct;
