import { createAction } from './utils';

export const STATE_KEY = 'modal';
export const INITIAL_STATE = {
  confirmModal: null,
  errorModal: null,
  modal: null,
};

// actions

export const SET_CONFIRM = 'SET_CONFIRM';
export const SET_ERROR = 'SET_ERROR';
export const SET_MODAL = 'SET_MODAL';
export const CLEAR_MODAL = 'CLEAR_MODAL';

// reducers

export default function modalReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case SET_CONFIRM:
      return {
        ...state,
        confirmModal: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        errorModal: action.payload,
      };
    case SET_MODAL:
      return {
        ...state,
        modal: action.payload,
      };
    case CLEAR_MODAL:
      return INITIAL_STATE;
    default:
      return state;
  }
}

// action creators

export const setConfirm = (confirm) =>
  createAction(SET_CONFIRM, {
    ...confirm,
    confirm: () => {
      if (typeof confirm.confirm !== 'function') return;

      if (confirm.params) {
        confirm.confirm(...confirm.params);
      } else {
        confirm.confirm();
      }
    },
  });

export const setError = (rawError) => {
  let error = rawError;

  if (typeof error === 'string') {
    error = { message: error };
  }
  if (!error.message && error.data) {
    error = { ...error, message: error.data };
  }

  return createAction(SET_ERROR, error);
};

export const setModal = (def) => createAction(SET_MODAL, def);

export const clearModal = () => createAction(CLEAR_MODAL);
