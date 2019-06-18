import axios from 'axios';
import { setError } from 'ducks/modal';
import update from 'immutability-helper';

export const FETCH_PRODUCT_BEGIN = 'FETCH_PRODUCT_BEGIN';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

const initialState = {
  products: [],
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCT_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.products,
        loading: false,
      };
    case FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        err: action.payload.error,
        loading: false,
      };
    case UPDATE_PRODUCT:
      // eslint-disable-next-line no-case-declarations
      const idx = state.products.findIndex((p) => p.id === action.payload.product.id);
      return {
        ...state,
        products: update(state.products, {
          $splice: [[idx, 1, action.payload.product]],
        }),
      };
    case ADD_PRODUCT:
      return {
        ...state,
        products: update(state.products, { $push: [action.payload.product] }),
      };
    case REMOVE_PRODUCT:
      // eslint-disable-next-line no-case-declarations
      const index = state.products.findIndex((p) => p.id === action.payload.product_id);
      return {
        ...state,
        products: update(state.products, { $splice: [[index, 1]] }),
      };
    default:
      return state;
  }
}

export const beginFetchProducts = () => ({
  type: FETCH_PRODUCT_BEGIN,
});

export const setProducts = (products) => (dispatch) => {
  dispatch({
    type: SET_PRODUCTS,
    payload: { products },
  });
  return Promise.resolve();
};

export const addProduct = (product) => ({
  type: ADD_PRODUCT,
  payload: { product },
});

export const removeProduct = (product_id) => ({
  type: REMOVE_PRODUCT,
  payload: { product_id },
});

export const updateProduct = (product) => ({
  type: UPDATE_PRODUCT,
  payload: { product },
});

export const fetchProductsFailure = (error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: { error },
});

export const fetchProducts = (skill_id) => {
  return (dispatch) => {
    dispatch(beginFetchProducts());
    return axios
      .get(`/skill/${skill_id}/products`)
      .then((res) => {
        dispatch(setProducts(res.data));
      })
      .catch((err) => {
        console.error(err.response);
        dispatch(fetchProductsFailure('Could Not Retreieve Products'));
      });
  };
};

export const copyProduct = (skill_id, product_id) => {
  return (dispatch, getState) => {
    return axios
      .post(`/skill/${skill_id}/${product_id}/${getState().account.id}/copy`)
      .then((res) => {
        dispatch(addProduct(res.data));
      })
      .catch((err) => {
        console.error(err);
        dispatch(setError('Unable to Copy Project'));
      });
  };
};

export const deleteProduct = (skill_id, product_id) => {
  return (dispatch) => {
    axios
      .delete(`/skill/${skill_id}/product/${product_id}`)
      .then(() => {
        dispatch(removeProduct(product_id));
      })
      .catch((err) => {
        console.error(err);
        dispatch(setError('Error Encountered - Unable to Delete Product'));
      });
  };
};
