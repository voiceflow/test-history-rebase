import moment from 'moment';

import client from '@/client';
import { NEW_PRODUCT_ID } from '@/constants';
import { activeLocalesSelector, activeSkillIDSelector } from '@/ducks/skill';
import createCRUDReducer, { createCRUDActionCreators, createCRUDSelectors } from '@/ducks/utils/crud';

import { createNewProduct } from './utils';

// state

export const STATE_KEY = 'product';

// reducers

const productReducer = createCRUDReducer(STATE_KEY);

export default productReducer;

// selectors

export const {
  root: rootProductsSelector,
  all: allProductsSelector,
  byID: productByIDSelector,
  findByIDs: productsByIDsSelector,
  has: hasProductsSelector,
} = createCRUDSelectors(STATE_KEY);

// action creators

export const { add: addProduct, update: updateProduct, remove: removeProduct, replace: replaceProducts } = createCRUDActionCreators(STATE_KEY);

// side effects

export const loadProductsForSkill = (skillID) => async (dispatch) => {
  const products = await client.skill.findProducts(skillID);

  dispatch(replaceProducts(products));

  return products;
};

export const createProduct = () => async (dispatch, getState) => {
  const state = getState();
  const locales = activeLocalesSelector(state);

  const product = createNewProduct(locales);

  dispatch(addProduct(product.id, product));
};

export const copyProduct = (skillID, productID) => async (dispatch) => {
  const copiedProduct = await client.product.copy(skillID, productID);

  dispatch(addProduct(copiedProduct.id, copiedProduct));
};

export const deleteProduct = (skillID, productID) => async (dispatch) => {
  await client.product.delete(skillID, productID);

  await dispatch(loadProductsForSkill(skillID));
};

export const cancelProduct = () => (dispatch) => dispatch(removeProduct(NEW_PRODUCT_ID));

export const uploadProduct = (productID) => async (dispatch, getState) => {
  const state = getState();
  const product = productByIDSelector(state)(productID);
  const skillID = activeSkillIDSelector(state);

  if (product.id === NEW_PRODUCT_ID) {
    const releaseDate = moment().format('YYYY-MM-DD');

    await client.product.create({ ...product, releaseDate, skill: skillID });
  } else {
    await client.product.update({ ...product, skill: skillID });
  }

  await dispatch(loadProductsForSkill(skillID));
};
