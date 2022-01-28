import { createAction, createAsyncAction, createCRUDActions, createType } from '@realtime-sdk/actions/utils';
import { PRODUCT_KEY } from '@realtime-sdk/constants';
import { Product } from '@realtime-sdk/models';
import { BaseVersionPayload } from '@realtime-sdk/types';
import { Constants } from '@voiceflow/alexa-types';

const productType = createType(PRODUCT_KEY);

// Other

export interface UpdateLocalesPayload extends BaseVersionPayload {
  locales: Constants.Locale[];
}

export interface CreateProductPayload extends BaseVersionPayload {
  product: Product;
}

export const updateLocales = createAction<UpdateLocalesPayload>(productType('UPDATE_LOCALES'));

export const create = createAsyncAction<CreateProductPayload, Product>(productType('CREATE_PRODUCT'));

export const crud = createCRUDActions<Product, BaseVersionPayload>(productType);
