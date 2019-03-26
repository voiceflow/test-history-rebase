const SET_CONFIRM = 'SET_CONFIRM'
const SET_ERROR = 'SET_ERROR'
const SET_DEFAULT = 'SET_DEFAULT'
const CLEAR_MODAL = 'CLEAR_MODAL'

const initialState = {
  confirmModal: null,
  errorModal: null,
  defaultModal: null,
}

export default function modalReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CONFIRM:
      return {
        ...state,
        confirmModal: action.payload.confirm
      }
    case SET_ERROR:
      return {
        ...state,
        errorModal: action.payload.error
      }
    case SET_DEFAULT:
      return {
        ...state,
        defaultModal: action.payload.def
      }
    case CLEAR_MODAL:
      return {
        ...state,
        confirmModal: null,
        errorModal: null,
        defaultModal: null,
      }
    default:
      return state
  }
}

export const setConfirm = confirm => ({
  type: "SET_CONFIRM",
  payload: {
    confirm: {
      ...confirm,
      confirm: () => {
        if (typeof confirm.confirm !== 'function') return

        if (confirm.params) {
          confirm.confirm(...confirm.params)
        } else {
          confirm.confirm()
        }
      }
    }
  }
})

export const setError = error => {
  if(typeof error === 'string') error = {message: error}

  return {
    type: "SET_ERROR",
    payload: {
      error
    }
  }
}

export const setDefault = def => ({
  type: "SET_DEFAULT",
  payload: {
    def
  }
})

export const clearModal = () => ({
  type: "CLEAR_MODAL"
})