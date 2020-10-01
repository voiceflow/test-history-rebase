import { Locale } from '@voiceflow/alexa-types';

import clientV2 from '@/clientV2';
import { productAdapter } from '@/clientV2/adapters/project';
import { NEW_PRODUCT_ID } from '@/constants';
import * as Skill from '@/ducks/skill';
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

export const createProduct = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const locales = Skill.activeLocalesSelector(state);

  const product = createNewProduct(locales);

  dispatch(addProduct(product.id, product));
};

export const copyProduct = (productID: string): Thunk => async (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  const copiedProduct = await clientV2.alexaService.project.copyProduct(projectID, productID);

  dispatch(addProduct(copiedProduct.productID, productAdapter.fromDB(copiedProduct)));
};

export const deleteProduct = (productID: string): Thunk => async (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  await clientV2.alexaService.project.deleteProduct(projectID, productID);

  dispatch(removeProduct(productID));
};

export const cancelProduct = (): Thunk => (dispatch) => dispatch(removeProduct(NEW_PRODUCT_ID));

export const uploadProduct = (productID: string): Thunk => async (dispatch, getState) => {
  const state = getState();
  const product = productByIDSelector(state)(productID);
  const projectID = Skill.activeProjectIDSelector(state);

  if (product.id === NEW_PRODUCT_ID) {
    const alexaProduct = await clientV2.alexaService.project.createProduct(projectID, productAdapter.toDB(product));

    dispatch(cancelProduct());
    dispatch(addProduct(alexaProduct.productID, productAdapter.fromDB(alexaProduct)));
  } else {
    await clientV2.alexaService.project.updateProduct(projectID, productID, { ...productAdapter.toDB(product), productID });

    dispatch(addProduct(productID, product));
  }
};

export const handleSkillLocaleChange = (locales: Locale[]): Thunk => async (dispatch, getState) => {
  const state = getState();
  const allProducts = allProductsSelector(state);
  const projectID = Skill.activeProjectIDSelector(state);

  if (allProducts.length) {
    allProducts.forEach((product) => dispatch(updateProduct(product.id, { locales }, true)));

    await Promise.all(
      allProducts.map((product) =>
        clientV2.alexaService.project.updateProduct(projectID, product.id, { ...productAdapter.toDB(product), productID: product.id })
      )
    );
  }
};
