import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class UpdateProductLocales extends AbstractVersionResourceControl<Realtime.product.UpdateLocalesPayload> {
  protected actionCreator = Realtime.product.updateLocales;

  protected process = async (ctx: Context, { payload }: Action<Realtime.product.UpdateLocalesPayload>) => {
    const { creatorID } = ctx.data;
    const products = await this.services.product.getAll(creatorID, payload.projectID).then(Realtime.Adapters.productAdapter.mapFromDB);

    await Promise.all(
      products.map((product) =>
        this.services.product.update(
          creatorID,
          payload.projectID,
          product.id,
          Realtime.Adapters.productAdapter.toDB({ ...product, locales: payload.locales })
        )
      )
    );
  };

  protected finally = async (ctx: Context, { payload }: Action<Realtime.product.UpdateLocalesPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default UpdateProductLocales;
