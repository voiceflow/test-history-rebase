
import update from 'immutability-helper'

const initialState = {
    email_templates: [],
}

export default function emailReducer(state = initialState, action) {
    switch(action.type){
        case 'FETCH_EMAIL_BEGIN':
            return {
                ...state,
                loading: true,
            }
        case 'SET_EMAILS':
            return {
                ...state,
                email_templates: action.payload.emails,
                loading: false,
            }
        case 'FETCH_EMAILS_FAILURE':
            return {
                ...state,
                err: action.payload.error,
                loading: false,
            }
        case 'UPDATE_EMAIL':
            let idx = state.email_templates.findIndex(p => p.template_id === action.payload.email.template_id);
            return {
                ...state,
                email_templates: update(state.email_templates, {$splice: [[idx, 1, action.payload.email]]})
            }
        case 'ADD_EMAIL':
            return {
                ...state,
                email_templates: update(state.email_templates, {$push: [action.payload.email]})
            }
        case 'REMOVE_EMAIL':
            let index = state.email_templates.findIndex(p => p.template_id === action.payload.email_id);
            return {
                ...state,
                email_templates: update(state.email_templates, {$splice: [[index, 1]]})
            }
        default:
            return state
    }
}