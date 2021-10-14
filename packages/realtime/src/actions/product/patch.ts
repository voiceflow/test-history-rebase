import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type PatchProductPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Partial<Realtime.Product>>;

class PatchProduct extends AbstractVersionResourceControl<PatchProductPayload> {
  protected actionCreator = Realtime.product.crud.patch;

  process = async (ctx: Context, { payload }: Action<PatchProductPayload>) => {
    const creatorID = Number(ctx.userId);
    const product = await this.services.product.get(creatorID, payload.projectID, payload.key).then(Realtime.Adapters.productAdapter.fromDB);

    const patchedProduct = Realtime.Adapters.productAdapter.toDB({ ...product, ...payload.value });

    await this.services.product.update(creatorID, payload.projectID, payload.key, patchedProduct);
  };
}

export default PatchProduct;
