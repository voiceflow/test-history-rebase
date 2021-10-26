import * as Realtime from '@voiceflow/realtime-sdk';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';
import { Context } from '@/types';

type AddProductPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Product>;

class AddProduct extends AbstractVersionResourceControl<AddProductPayload> {
  protected actionCreator = Realtime.product.crud.add;

  process = async (ctx: Context, { payload }: Action<AddProductPayload>) => {
    await this.services.product.create(
      ctx.data.creatorID,
      payload.projectID,
      Realtime.Adapters.productAdapter.toDB({ ...payload.value, id: payload.key })
    );
  };
}

export default AddProduct;
