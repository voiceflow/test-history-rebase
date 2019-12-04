export const SET_CONFIRM = 'SET_CONFIRM';
export const SET_ERROR = 'SET_ERROR';
export const SET_MODAL = 'SET_MODAL';
export const CLEAR_MODAL = 'CLEAR_MODAL';

const initialState = {
  confirmModal: null,
  errorModal: null,
  modal: null,
};

export default function modalReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CONFIRM:
      return {
        ...state,
        confirmModal: action.payload.confirm,
      };
    case SET_ERROR:
      return {
        ...state,
        errorModal: action.payload.error,
      };
    case SET_MODAL:
      return {
        ...state,
        modal: action.payload.def,
      };

    case CLEAR_MODAL:
      return {
        ...state,
        confirmModal: null,
        errorModal: null,
        modal: null,
      };
    default:
      return state;
  }
}

export const setConfirm = (confirm) => ({
  type: SET_CONFIRM,
  payload: {
    confirm: {
      ...confirm,
      confirm: () => {
        if (typeof confirm.confirm !== 'function') return;

        if (confirm.params) {
          confirm.confirm(...confirm.params);
        } else {
          confirm.confirm();
        }
      },
    },
  },
});

export const setError = (rawError) => {
  let error = rawError;

  if (typeof error === 'string') error = { message: error };
  if (!error.message && error.data) error.message = error.data;
  return {
    type: SET_ERROR,
    payload: {
      error,
    },
  };
};

export const setModal = (def) => ({
  type: SET_MODAL,
  payload: {
    def,
  },
});

export const clearModal = () => ({
  type: CLEAR_MODAL,
});
