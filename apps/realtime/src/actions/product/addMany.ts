import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AbstractVersionResourceControl } from '@/actions/version/utils';

type AddManyProductsPayload = Realtime.BaseVersionPayload & Realtime.actionUtils.CRUDValuesPayload<Realtime.Product>;

class AddManyProducts extends AbstractVersionResourceControl<AddManyProductsPayload> {
  protected actionCreator = Realtime.product.crud.addMany;

  process = Utils.functional.noop;
}

export default AddManyProducts;
