import { Constants } from '@voiceflow/alexa-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import cuid from 'cuid';

import client from '@/client';
import * as Errors from '@/config/errors';
import { FeatureFlag } from '@/config/features';
import { NEW_PRODUCT_ID } from '@/constants';
import * as Feature from '@/ducks/feature';
import * as ProductV2 from '@/ducks/productV2';
import * as Session from '@/ducks/session';
import { Meta } from '@/ducks/utils/crud';
import { getActiveVersionContext } from '@/ducks/version/utils';
import { Product } from '@/models';
import { SyncThunk, Thunk } from '@/store/types';

import { crud } from './actions';

/**
 * @deprecated changes to this resource are synchronized by the realtime service
 */
export const replaceProducts =
  <M extends Meta>(products: Product[], meta?: M): SyncThunk =>
  (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    dispatch(crud.replace(products, meta));
  };

export const addProduct =
  (product: Product): Thunk =>
  async (dispatch, getState) => {
    const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(FeatureFlag.ATOMIC_ACTIONS);
    if (!isAtomicActions) return;

    const context = dispatch(getActiveVersionContext());

    await dispatch.sync(Realtime.product.crud.add({ ...context, key: product.id, value: product }));
  };

/**
 * create a clone of a product and return its ID
 */
export const cloneProduct =
  (product: Product): Thunk<string> =>
  async (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const projectID = Session.activeProjectIDSelector(getState());

          Errors.assertProjectID(projectID);

          const alexaProduct = await client.platform.alexa.project
            .createProduct(projectID, Realtime.Adapters.productAdapter.toDB({ ...product, id: NEW_PRODUCT_ID }))
            .then(Realtime.Adapters.productAdapter.fromDB);

          dispatch(crud.add(alexaProduct.id, alexaProduct));

          return alexaProduct.id;
        },
        async (context) => {
          const clonedProductID = cuid.slug();
          const clonedProduct = { ...product, id: clonedProductID };

          await dispatch.sync(Realtime.product.crud.add({ ...context, key: clonedProductID, value: clonedProduct }));

          return clonedProductID;
        }
      )
    );

/**
 * find and duplicate a product by ID
 */
export const duplicateProduct =
  (productID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const product = ProductV2.productByIDSelector(state, { id: productID });

    Errors.assertProduct(productID, product);

    await dispatch(cloneProduct(product));
  };

export const patchProduct =
  (productID: string, data: Partial<Product>): Thunk =>
  (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const projectID = Session.activeProjectIDSelector(getState());

          Errors.assertProjectID(projectID);

          dispatch(crud.patch(productID, data));
        },
        async (context) => {
          await dispatch.sync(Realtime.product.crud.patch({ ...context, key: productID, value: data }));
        }
      )
    );

export const deleteProduct =
  (productID: string): Thunk =>
  (dispatch, getState) =>
    dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const projectID = Session.activeProjectIDSelector(getState());

          Errors.assertProjectID(projectID);

          await client.platform.alexa.project.deleteProduct(projectID, productID);

          dispatch(crud.remove(productID));
        },
        async (context) => {
          await dispatch.sync(Realtime.product.crud.remove({ ...context, key: productID }));
        }
      )
    );

/**
 * @deprecated changes to products are now synced by the realtime service
 */
export const uploadNewProduct =
  (product: Product): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);

    const alexaProduct = await client.platform.alexa.project
      .createProduct(projectID, Realtime.Adapters.productAdapter.toDB(product))
      .then(Realtime.Adapters.productAdapter.fromDB);

    dispatch(crud.add(alexaProduct.id, alexaProduct));
  };

/**
 * @deprecated changes to products are now synced by the realtime service
 */
export const uploadProduct =
  (productID: string): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const isAtomicActions = Feature.isFeatureEnabledSelector(state)(FeatureFlag.ATOMIC_ACTIONS);
    if (isAtomicActions) return;

    const product = ProductV2.productByIDSelector(state, { id: productID });
    const projectID = Session.activeProjectIDSelector(state);

    Errors.assertProjectID(projectID);
    Errors.assertProduct(productID, product);

    await client.platform.alexa.project.updateProduct(projectID, productID, { ...Realtime.Adapters.productAdapter.toDB(product), productID });

    dispatch(crud.add(productID, product));
  };

export const updateAllProductLocales =
  (locales: Constants.Locale[]): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const allProducts = ProductV2.allProductsSelector(state);

    if (!allProducts.length) return;

    await dispatch(
      Feature.applyAtomicSideEffect(
        getActiveVersionContext,
        async () => {
          const projectID = Session.activeProjectIDSelector(state);

          Errors.assertProjectID(projectID);

          await Promise.all(
            allProducts.map((product) => {
              dispatch(crud.patch(product.id, { locales }));

              return client.platform.alexa.project.updateProduct(projectID, product.id, {
                ...Realtime.Adapters.productAdapter.toDB({ ...product, locales }),
                productID: product.id,
              });
            })
          );
        },
        async (context) => {
          await dispatch.sync(Realtime.product.updateLocales({ ...context, locales }));
        }
      )
    );
  };
