import * as Realtime from '@voiceflow/realtime-sdk';

import { terminateResend } from '@/actions/utils';
import { AbstractVersionResourceControl } from '@/actions/version/utils';

class CreateProduct extends AbstractVersionResourceControl<Realtime.product.CreateProductPayload> {
  protected actionCreator = Realtime.product.create.started;

  protected resend = terminateResend;

  process = this.reply(Realtime.product.create, async ({ data }, { payload }) => {
    const { creatorID } = data;

    const product = await this.services.product
      .create(creatorID, payload.projectID, Realtime.Adapters.productAdapter.toDB({ ...payload.product }))
      .then(Realtime.Adapters.productAdapter.fromDB);

    await this.server.processAs(
      creatorID,
      Realtime.product.crud.add({
        key: product.id,
        value: product,
        versionID: payload.versionID,
        projectID: payload.projectID,
        workspaceID: payload.workspaceID,
      })
    );

    return product;
  });
}

export default CreateProduct;
