
import update from 'immutability-helper'
import axios from 'axios'

export const FETCH_EMAIL_BEGIN = 'FETCH_EMAIL_BEGIN'
export const SET_EMAILS = 'SET_EMAILS'
export const ADD_EMAIL = 'ADD_EMAIL'
export const REMOVE_EMAIL = 'REMOVE_EMAIL'
export const FETCH_EMAILS_FAILURE = 'FETCH_EMAILS_FAILURE'
export const UPDATE_EMAIL = 'UPDATE_EMAIL'

const initialState = {
    email_templates: [],
}

export default function emailReducer(state = initialState, action) {
    switch(action.type){
        case FETCH_EMAIL_BEGIN:
            return {
                ...state,
                loading: true,
            }
        case SET_EMAILS:
            return {
                ...state,
                email_templates: action.payload.emails,
                loading: false,
            }
        case FETCH_EMAILS_FAILURE:
            return {
                ...state,
                err: action.payload.error,
                loading: false,
            }
        case UPDATE_EMAIL:
            let idx = state.email_templates.findIndex(p => p.template_id === action.payload.email.template_id);
            return {
                ...state,
                email_templates: update(state.email_templates, {$splice: [[idx, 1, action.payload.email]]})
            }
        case ADD_EMAIL:
            return {
                ...state,
                email_templates: update(state.email_templates, {$push: [action.payload.email]})
            }
        case REMOVE_EMAIL:
            let index = state.email_templates.findIndex(p => p.template_id === action.payload.email_id);
            return {
                ...state,
                email_templates: update(state.email_templates, {$splice: [[index, 1]]})
            }
        default:
            return state
    }
}

export const beginFetchEmails = () => ({
    type: "FETCH_EMAIL_BEGIN"
});

export const setEmails = emails => dispatch => {
    dispatch({
        type: "SET_EMAILS",
        payload: { emails }
    })
    return Promise.resolve()
}

export const addEmail = email => ({
    type: "ADD_EMAIL",
    payload: { email }
})

export const removeEmail = email_id => ({
    type: "REMOVE_EMAIL",
    payload: { email_id }
})

export const fetchEmailsFailure = error => ({
    type: "FETCH_EMAILS_FAILURE",
    payload: { error }
})

export const updateEmail = email => ({
    type: "UPDATE_EMAIL",
    payload: { email }
})

export const fetchEmails = skill_id => {
    return dispatch => {
        dispatch(beginFetchEmails())
        return axios.get(`/email/templates?skill_id=${skill_id}`).then(res => {
            let emails = res.data.map(t => {
                let variables = [];
                if (t.variables) {
                    try {
                        variables = JSON.parse(t.variables);
                    } catch (err) {
                        console.error(err);
                    }
                }

                return {
                    title: t.title,
                    sender: t.sender,
                    template_id: t.template_id,
                    variables: variables
                }
            })
            dispatch(setEmails(emails))
        })
        .catch(err => {
            console.error(err.response);
            dispatch(fetchEmailsFailure('Could Not Retreieve Emails'))
        })
    }
}

export const deleteEmail = (email_id) => {
    return dispatch => {
        return axios.delete(`/email/template/${email_id}`).then(() => {
            dispatch(removeEmail(email_id))
        })
    }
}