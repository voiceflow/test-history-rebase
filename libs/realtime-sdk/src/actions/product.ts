import type { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';

import { createCRUDActions } from '@/actions/utils';
import { PRODUCT_KEY } from '@/constants';
import type { Product } from '@/models';
import type { BaseVersionPayload } from '@/types';

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
