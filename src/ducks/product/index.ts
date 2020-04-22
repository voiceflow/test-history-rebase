import client from '@/client';
import { NEW_PRODUCT_ID } from '@/constants';
import { activeLocalesSelector, activeSkillIDSelector } from '@/ducks/skill';
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
} = createCRUDSelectors<Product>(STATE_KEY);

// action creators

export const { add: addProduct, update: updateProduct, remove: removeProduct, replace: replaceProducts } = createCRUDActionCreators<Product>(
  STATE_KEY
);

// side effects

export const loadProductsForSkill = (skillID: string): Thunk<Product[]> => async (dispatch) => {
  const products = await client.skill.findProducts(skillID);

  dispatch(replaceProducts(products));

  return products;
};

export const createProduct = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const locales = activeLocalesSelector(state);

  const product = createNewProduct(locales);

  dispatch(addProduct(product.id, product as Product));
};

export const copyProduct = (skillID: string, productID: string): Thunk => async (dispatch) => {
  const copiedProduct = await client.product.copy(skillID, productID);

  dispatch(addProduct(String(copiedProduct.id), copiedProduct));
};

export const deleteProduct = (skillID: string, productID: string): Thunk => async (dispatch) => {
  await client.product.delete(skillID, productID);

  await dispatch(loadProductsForSkill(skillID));
};

export const cancelProduct = (): Thunk => (dispatch) => dispatch(removeProduct(NEW_PRODUCT_ID));

export const uploadProduct = (productID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const product = productByIDSelector(state)(productID);
  const skillID = activeSkillIDSelector(state);

  if (product.id === (NEW_PRODUCT_ID as any)) {
    await client.product.create({ ...product, skill: skillID });
  } else {
    await client.product.update({ ...product, skill: skillID });
  }

  await dispatch(loadProductsForSkill(skillID));
};
