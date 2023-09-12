import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractVersionResourceControl } from '@/legacy/actions/version/utils';

type AddProductPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuePayload<Realtime.Product>;

class AddProduct extends AbstractVersionResourceControl<AddProductPayload> {
  protected actionCreator = Realtime.product.crud.add;

  process = Utils.functional.noop;
}

export default AddProduct;
