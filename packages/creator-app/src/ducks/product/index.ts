import { Constants } from '@voiceflow/alexa-types';
import { batch } from 'react-redux';

import client from '@/client';
import { productAdapter } from '@/client/adapters/project';
import * as Errors from '@/config/errors';
import { NEW_PRODUCT_ID } from '@/constants';
import * as Session from '@/ducks/session';
import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from '@/ducks/utils/crud';
import { activeLocalesSelector } from '@/ducks/version/selectors';
import { Product } from '@/models';
import { Thunk } from '@/store/types';

import { createNewProduct } from './utils';

// state

export const STATE_KEY = 'product';

// reducers

const productReducer = createCRUDReducer<Product>(STATE_KEY);

export default productReducer;

// selectors

export const {
  root: rootProductsSelector,
  all: allProductsSelector,
  byID: productByIDSelector,
  findByIDs: productsByIDsSelector,
  has: hasProductsSelector,
  map: productMapSelector,
} = createCRUDSelectors(STATE_KEY);

// action creators

export const { add: addProduct, update: updateProduct, remove: removeProduct, replace: replaceProducts } = createCRUDActionCreators(STATE_KEY);

// side effects

export const createProduct = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const locales = activeLocalesSelector(state);

  const product = createNewProduct(locales as Constants.Locale[]);

  dispatch(addProduct(product.id, product));
};

export const copyProduct =
  (productID: string): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());

    Errors.assertProjectID(projectID);

    const copiedProduct = await client.platform.alexa.project.copyProduct(projectID, productID);

    dispatch(addProduct(copiedProduct.productID, productAdapter.fromDB(copiedProduct)));
  };

export const deleteProduct =
  (productID: string): Thunk =>
  async (dispatch, getState) => {
    const projectID = Session.activeProjectIDSelector(getState());

    Errors.assertProjectID(projectID);

    await client.platform.alexa.project.deleteProduct(projectID, productID);

    dispatch(removeProduct(productID));
  };

export const cancelProduct = (): Thunk => (dispatch) => dispatch(removeProduct(NEW_PRODUCT_ID));

export const uploadProduct =
  (productID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const product = productByIDSelector(state)(productID);
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    if (product.id === NEW_PRODUCT_ID) {
      const alexaProduct = await client.platform.alexa.project.createProduct(projectID, productAdapter.toDB(product));

      batch(() => {
        dispatch(cancelProduct());
        dispatch(addProduct(alexaProduct.productID, productAdapter.fromDB(alexaProduct)));
      });
    } else {
      await client.platform.alexa.project.updateProduct(projectID, productID, { ...productAdapter.toDB(product), productID });

      dispatch(addProduct(productID, product));
    }
  };

export const saveAllProductLocales =
  (locales: Constants.Locale[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const allProducts = allProductsSelector(state);
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    if (allProducts.length) {
      await Promise.all(
        allProducts.map((product) => {
          dispatch(updateProduct(product.id, { locales }, true));

          return client.platform.alexa.project.updateProduct(projectID, product.id, {
            ...productAdapter.toDB({ ...product, locales }),
            productID: product.id,
          });
        })
      );
    }
  };

export const copyNewProduct =
  (product: Product): Thunk<string> =>
  async (dispatch, getState) => {
    const state = getState();
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const alexaProduct = await client.platform.alexa.project.createProduct(projectID, productAdapter.toDB({ ...product, id: NEW_PRODUCT_ID }));

    dispatch(addProduct(alexaProduct.productID, productAdapter.fromDB(alexaProduct)));

    return alexaProduct.productID;
  };
