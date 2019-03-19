import {
    SET_CONFIRM,
    SET_ERROR,
    SET_DEFAULT,
    CLEAR_MODAL,
} from '../actions/modalActions'

const initialState = {
    confirmModal: null,
    errorModal: null,
    defaultModal: null,
}

export default function modalReducer(state = initialState, action) {
    switch(action.type) {
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