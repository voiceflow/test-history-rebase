import { Constants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';

import { PRODUCT_KEY } from '../constants';
import { Product } from '../models';
import { BaseVersionPayload } from '../types';
import { createCRUDActions } from './utils';

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
