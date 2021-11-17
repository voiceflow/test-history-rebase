import { Constants } from '@voiceflow/alexa-types';

import { PRODUCT_KEY } from '../constants';
import { Product } from '../models';
import { BaseVersionPayload } from '../types';
import { createAction, createCRUDActions, typeFactory } from './utils';

const productType = typeFactory(PRODUCT_KEY);

// Other

export interface UpdateLocalesPayload extends BaseVersionPayload {
  locales: Constants.Locale[];
}

export interface CreateProductPayload extends BaseVersionPayload {
  product: Product;
}

export const updateLocales = createAction<UpdateLocalesPayload>(productType('UPDATE_LOCALES'));

export const create = createAction.async<CreateProductPayload, Product>(productType('CREATE_PRODUCT'));

export const crud = createCRUDActions<BaseVersionPayload, Product>(productType);
