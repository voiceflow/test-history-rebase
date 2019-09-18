import axios from 'axios';
import update from 'immutability-helper';

import { setError } from '@/ducks/modal';

import { createNewProduct, getFormattedProduct, normalizeProductLocale, parseProduct } from './utils';

export const FETCH_PRODUCT_BEGIN = 'FETCH_PRODUCT_BEGIN';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const CANCEL_PRODUCT = 'CANCEL_PRODUCT';
export const COPY_PRODUCT = 'COPY_PRODUCT';
export const REPLACE_PRODUCT = 'REPLACE_PRODUCT';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

export const NEW_PRODUCT_ID = 'new';
export const DEFAULT_PHRASE = 'Alexa, ';
export const TAX_CATEGORY = [
  { value: 'INFORMATION_SERVICES', label: 'Information Services' },
  { value: 'NEWSPAPERS', label: 'NewsPaper' },
  { value: 'PERIODICALS', label: 'Periodicals' },
  { value: 'SOFTWARE', label: 'Software' },
  { value: 'STREAMING_RADIO', label: 'Streaming Radio' },
  { value: 'VIDEO', label: 'Video' },
];

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
    case ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, createNewProduct(action.payload.locale)],
      };
    case CANCEL_PRODUCT:
      return {
        ...state,
        products: state.products.filter((product) => product.id !== NEW_PRODUCT_ID),
      };
    case COPY_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload.product],
      };
    case REPLACE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) => (product.id === NEW_PRODUCT_ID ? action.payload.product : product)),
      };
    case UPDATE_PRODUCT:
      // eslint-disable-next-line no-case-declarations
      const { product } = action.payload;

      return {
        ...state,
        products: state.products.map((existingProduct) => (existingProduct.id === product.id ? product : existingProduct)),
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

export const removeProduct = (product_id) => ({
  type: REMOVE_PRODUCT,
  payload: { product_id },
});

export const addProduct = (locale) => ({
  type: ADD_PRODUCT,
  payload: { locale },
});

export const cancelProduct = () => ({
  type: CANCEL_PRODUCT,
});

export const copyNewProduct = (product) => ({
  type: COPY_PRODUCT,
  payload: { product },
});

export const updateProduct = (product) => ({
  type: UPDATE_PRODUCT,
  payload: { product },
});

export const replaceProduct = (product) => ({
  type: REPLACE_PRODUCT,
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
        dispatch(setProducts(res.data.map((product) => parseProduct(product))));
      })
      .catch((err) => {
        console.error(err.response);
        dispatch(fetchProductsFailure('Could Not Retreieve Products'));
      });
  };
};

export const copyProduct = (skill_id, product_id) => {
  return (dispatch) => {
    return axios
      .post(`/skill/${skill_id}/product/${product_id}/copy`)
      .then((res) => {
        dispatch(copyNewProduct(parseProduct(res.data)));
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
        dispatch(setError(err.response.data || 'Error Encountered - Unable to Delete Product'));
      });
  };
};

export const uploadProduct = (rawProduct, skill) => {
  const normalizedProduct = normalizeProductLocale(rawProduct, skill.locales);
  const product = getFormattedProduct(normalizedProduct, skill.skill_id);

  if (product.id === NEW_PRODUCT_ID) {
    return (dispatch) => {
      axios
        .post('/skill/product?new=1', product)
        .then((res) => {
          dispatch(replaceProduct({ ...normalizedProduct, id: res.data.id }));
        })
        .catch((err) => {
          dispatch(setError(err.response.data || 'Error Encountered - Unable to Upload Product'));
        });
    };
  }
  return (dispatch) => {
    dispatch(updateProduct(normalizedProduct));

    return axios.post('/skill/product', product).catch((err) => {
      console.error(err);
      dispatch(setError(err.response.data || 'Error Encountered - Unable to Upload Product'));
    });
  };
};
