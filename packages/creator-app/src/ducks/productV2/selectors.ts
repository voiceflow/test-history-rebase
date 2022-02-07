import * as Feature from '@/ducks/feature';
import * as ProductSelectorsV1 from '@/ducks/product/selectors';
import { createCRUDSelectors, idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';

import { STATE_KEY } from './constants';

const {
  all: _allProductsSelector,
  map: _productMapSelector,
  byID: _productByIDSelector,
  byIDs: _productsByIDsSelector,
} = createCRUDSelectors(STATE_KEY);

export const allProductsSelector = Feature.createAtomicActionsSelector([ProductSelectorsV1.allProductsSelector, _allProductsSelector]);

export const productMapSelector = Feature.createAtomicActionsSelector([ProductSelectorsV1.productMapSelector, _productMapSelector]);

export const productByIDSelector = Feature.createAtomicActionsSelector(
  [ProductSelectorsV1.productByIDSelector, _productByIDSelector, idParamSelector],
  (getProductsV1, productsV2, productID) => [productID ? getProductsV1(productID) : null, productsV2]
);

export const productsByIDsSelector = Feature.createAtomicActionsSelector(
  [ProductSelectorsV1.productsByIDsSelector, _productsByIDsSelector, idsParamSelector],
  (getProductsV1, productsV2, productIDs) => [getProductsV1(productIDs), productsV2]
);
