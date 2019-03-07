import {
    SET_PREVIEW
} from '../actions/userActions';

const initialState = {
    preview: false
}

export default function userReducer(state = initialState, action) {
    switch(action.type) {
        case SET_PREVIEW:
            return {
                ...state,
                preview: action.payload.preview
            }
        default:
            return state
    }
}