import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { PRODUCT_KEY } from '@realtime-sdk/constants';
import { Product } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Constants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';

const productType = Utils.protocol.typeFactory(PRODUCT_KEY);

// Other

export interface UpdateLocalesPayload extends BaseVersionPayload {
  locales: Constants.Locale[];
}

export interface CreateProductPayload extends BaseVersionPayload {
  product: Product;
}

export const updateLocales = Utils.protocol.createAction<UpdateLocalesPayload>(productType('UPDATE_LOCALES'));

export const create = Utils.protocol.createAction.async<CreateProductPayload, Product>(productType('CREATE_PRODUCT'));

export const crud = createCRUDActions<BaseVersionPayload, Product>(productType);
