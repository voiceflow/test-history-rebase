import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';

import * as Errors from '@/config/errors';
import { waitAsync } from '@/ducks/utils';
import { getActiveVersionContext } from '@/ducks/versionV2/utils';
import { Thunk } from '@/store/types';

import { allProductsSelector, productByIDSelector } from './selectors';

export const createProduct =
  (product: Realtime.Product): Thunk =>
  async (dispatch, getState) => {
    await dispatch(waitAsync(Realtime.product.create, { ...getActiveVersionContext(getState()), product }));
  };

/**
 * create a clone of a product and return its ID
 */
export const cloneProduct =
  (product: Realtime.Product): Thunk<string> =>
  async (dispatch, getState) => {
    const clonedProductID = Utils.id.cuid.slug();
    const clonedProduct = { ...product, id: clonedProductID };

    await dispatch.sync(Realtime.product.crud.add({ ...getActiveVersionContext(getState()), key: clonedProductID, value: clonedProduct }));

    return clonedProductID;
  };

/**
 * find and duplicate a product by ID
 */
export const duplicateProduct =
  (productID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const product = productByIDSelector(state, { id: productID });

    Errors.assertProduct(productID, product);

    await dispatch(cloneProduct(product));
  };

export const patchProduct =
  (productID: string, data: Partial<Realtime.Product>): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.product.crud.patch({ ...getActiveVersionContext(getState()), key: productID, value: data }));
  };

export const deleteProduct =
  (productID: string): Thunk =>
  async (dispatch, getState) => {
    await dispatch.sync(Realtime.product.crud.remove({ ...getActiveVersionContext(getState()), key: productID }));
  };

export const updateAllProductLocales =
  (locales: AlexaConstants.Locale[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const allProducts = allProductsSelector(state);

    if (!allProducts.length) return;

    await dispatch.sync(Realtime.product.updateLocales({ ...getActiveVersionContext(getState()), locales }));
  };
