import { Context } from '@logux/server';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type AddProductPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Product>;

class AddProduct extends AbstractVersionResourceControl<AddProductPayload> {
  protected actionCreator = Realtime.product.crud.add;

  process = async (ctx: Context, { payload }: Action<AddProductPayload>) => {
    await this.services.product.create(
      Number(ctx.userId),
      payload.projectID,
      Realtime.Adapters.productAdapter.toDB({ ...payload.value, id: payload.key })
    );
  };
}

export default AddProduct;
