import { createCRUDActions } from '@realtime-sdk/actions/utils';
import { PRODUCT_KEY } from '@realtime-sdk/constants';
import type { Product } from '@realtime-sdk/models';
import type { BaseVersionPayload } from '@realtime-sdk/types';
import type { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';

const productType = Utils.protocol.typeFactory(PRODUCT_KEY);

// Other

export interface UpdateLocalesPayload extends BaseVersionPayload {
  locales: AlexaConstants.Locale[];
}

export interface CreateProductPayload extends BaseVersionPayload {
  product: Product;
}

export const updateLocales = Utils.protocol.createAction<UpdateLocalesPayload>(productType('UPDATE_LOCALES'));

export const create = Utils.protocol.createAsyncAction<CreateProductPayload, Product>(productType('CREATE_PRODUCT'));

export const crud = createCRUDActions<Product, BaseVersionPayload>(productType);
