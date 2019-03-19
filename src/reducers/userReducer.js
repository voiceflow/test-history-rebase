import {
    SET_PREVIEW,
    CANVAS_ERROR,
    CLOSE_CANVAS_ERROR,
    SET_TAB,
    CLOSE_TAB,
} from '../actions/userActions';
import update from 'immutability-helper'

const initialState = {
    preview: false,
    canvasError: [],
    tab: 'blocks',
    menuOpen: true,
}

export default function userReducer(state = initialState, action) {
    switch(action.type) {
        case SET_PREVIEW:
            return {
                ...state,
                preview: action.payload.preview
            }
        case CANVAS_ERROR:
            return {
                ...state,
                canvasError: update(state.canvasError, {$splice: [[0,1,action.payload.error]]})
            }
        case CLOSE_CANVAS_ERROR:
            return {
                ...state,
                canvasError: update(state.canvasError, {$splice: [[action.payload.idx, 1]]})
            }
        case SET_TAB:
            return {
                ...state,
                tab: action.payload.tab,
                menuOpen: true,
            }
        case CLOSE_TAB:
            return {
                ...state,
                menuOpen: false
            }
        default:
            return state
    }
}