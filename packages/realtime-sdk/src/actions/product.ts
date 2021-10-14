import { PRODUCT_KEY } from '../constants';
import { Product } from '../models';
import { BaseVersionPayload } from '../types';
import { createCRUDActions, typeFactory } from './utils';

const productType = typeFactory(PRODUCT_KEY);

export interface CopyProductPayload extends BaseVersionPayload {
  productID: string;
}

// Other

export const crud = createCRUDActions<BaseVersionPayload, Product>(productType);
