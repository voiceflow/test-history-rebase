
import update from 'immutability-helper'

const initialState = {
    displays: [],
}

export default function displayReducer(state = initialState, action) {
    switch(action.type){
        case 'FETCH_DISPLAY_BEGIN':
            return {
                ...state,
                loading: true,
            }
        case 'UPDATE_DISPLAY':
            let idx= state.displays.findIndex(p => p.display_id === action.payload.display.display_id);
            return {
                ...state,
                displays: update(state.displays, {$splice: [[idx, 1, action.payload.display]]})
            }
        case "ADD_DISPLAY":
            return {
                ...state,
                displays: update(state.displays, {$push: [action.payload.display]})
            }
        case 'SET_DISPLAYS':
            return {
                ...state,
                displays: action.payload.displays,
                loading: false,
            }
        case 'FETCH_DISPLAYS_FAILURE':
            return {
                ...state,
                err: action.payload.error,
                loading: false,
            }
        case 'REMOVE_DISPLAY':
            let index = state.displays.findIndex(p => p.display_id === action.payload.display_id);
            return {
                ...state,
                displays: update(state.displays, {$splice: [[index, 1]]})
            }
        default:
            return state
    }
}