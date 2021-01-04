import { Locale } from '@voiceflow/alexa-types';

import client from '@/client';
import { productAdapter } from '@/client/adapters/project';
import { NEW_PRODUCT_ID } from '@/constants';
import { activeLocalesSelector, activeProjectIDSelector } from '@/ducks/skill/skill/selectors';
import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from '@/ducks/utils/crud';
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

  const product = createNewProduct(locales as Locale[]);

  dispatch(addProduct(product.id, product));
};

export const copyProduct = (productID: string): Thunk => async (dispatch, getState) => {
  const projectID = activeProjectIDSelector(getState());

  const copiedProduct = await client.platform.alexa.project.copyProduct(projectID, productID);

  dispatch(addProduct(copiedProduct.productID, productAdapter.fromDB(copiedProduct)));
};

export const deleteProduct = (productID: string): Thunk => async (dispatch, getState) => {
  const projectID = activeProjectIDSelector(getState());

  await client.platform.alexa.project.deleteProduct(projectID, productID);

  dispatch(removeProduct(productID));
};

export const cancelProduct = (): Thunk => (dispatch) => dispatch(removeProduct(NEW_PRODUCT_ID));

export const uploadProduct = (productID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const product = productByIDSelector(state)(productID);
  const projectID = activeProjectIDSelector(state);

  if (product.id === NEW_PRODUCT_ID) {
    const alexaProduct = await client.platform.alexa.project.createProduct(projectID, productAdapter.toDB(product));

    dispatch(cancelProduct());
    dispatch(addProduct(alexaProduct.productID, productAdapter.fromDB(alexaProduct)));
  } else {
    await client.platform.alexa.project.updateProduct(projectID, productID, { ...productAdapter.toDB(product), productID });

    dispatch(addProduct(productID, product));
  }
};

export const handleSkillLocaleChange = (locales: Locale[]): Thunk => async (dispatch, getState) => {
  const state = getState();
  const allProducts = allProductsSelector(state);
  const projectID = activeProjectIDSelector(state);

  if (allProducts.length) {
    allProducts.forEach((product) => dispatch(updateProduct(product.id, { locales }, true)));

    await Promise.all(
      allProducts.map((product) =>
        client.platform.alexa.project.updateProduct(projectID, product.id, { ...productAdapter.toDB(product), productID: product.id })
      )
    );
  }
};

export const copyNewProduct = (product: Product): Thunk<string> => async (dispatch, getState) => {
  const state = getState();
  const projectID = activeProjectIDSelector(state);

  const alexaProduct = await client.platform.alexa.project.createProduct(projectID, productAdapter.toDB({ ...product, id: NEW_PRODUCT_ID }));

  dispatch(addProduct(alexaProduct.productID, productAdapter.fromDB(alexaProduct)));

  return alexaProduct.productID;
};
