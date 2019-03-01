import axios from 'axios'

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

export const FETCH_EMAIL_BEGIN = 'FETCH_EMAIL_BEGIN'
export const SET_EMAILS = 'SET_EMAILS'
export const ADD_EMAIL = 'ADD_EMAIL'
export const REMOVE_EMAIL = 'REMOVE_EMAIL'
export const FETCH_EMAILS_FAILURE = 'FETCH_EMAILS_FAILURE'