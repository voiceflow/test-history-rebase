import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { Context } from '@voiceflow/socket-utils';
import { Action } from 'typescript-fsa';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

type RemoveProductPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDKeyPayload;

class RemoveProduct extends AbstractVersionResourceControl<RemoveProductPayload> {
  protected actionCreator = Realtime.product.crud.remove;

  protected process = async (ctx: Context, { payload }: Action<RemoveProductPayload>) => {
    await this.services.product.delete(ctx.data.creatorID, payload.projectID, payload.key);
  };

  protected finally = async (ctx: Context, { payload }: Action<RemoveProductPayload>): Promise<void> => {
    await this.services.project.setUpdatedBy(payload.projectID, ctx.data.creatorID);
  };
}

export default RemoveProduct;
