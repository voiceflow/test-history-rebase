import {
    PUSH_VARIABLE,
    SET_VARIABLES
} from '../actions/variableActions'
import update from 'immutability-helper'

const initialState = {
    localVariables: [],
}

export default function variableReducer(state = initialState, action) {
    switch(action.type){
        case PUSH_VARIABLE:
            return {
                ...state,
                localVariables: update(state.localVariables, {$push: [action.payload.variable]})
            }
        case SET_VARIABLES:
            return{
                ...state,
                localVariables: action.payload.variables
            }
        default:
            return state
    }
}