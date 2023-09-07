import * as Realtime from '@voiceflow/realtime-sdk';
import { Context, terminateResend } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

class CreateProduct extends AbstractVersionResourceControl<Realtime.product.CreateProductPayload> {
  protected actionCreator = Realtime.product.create.started;

  protected resend = terminateResend;

  protected process = this.reply(Realtime.product.create, async ({ data }, { payload }) => {
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

  protected finally = async (ctx: Context, { payload }: Action<Realtime.product.CreateProductPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default CreateProduct;
