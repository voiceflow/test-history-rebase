import axios from 'axios'

export const beginFetchDisplays = () => ({
    type: "FETCH_DISPLAY_BEGIN"
});

export const setDisplays = displays => dispatch => {
    dispatch({
        type: "SET_DISPLAYS",
        payload: { displays }
    })
    return Promise.resolve()
}

export const updateDisplay = display => ({
    type: "UPDATE_DISPLAY",
    payload: {display}
})
export const addDisplay = display => ({
    type: "ADD_DISPLAY",
    payload: {display}
})

export const removeDisplay = display_id => ({
    type: "REMOVE_DISPLAY",
    payload: { display_id }
})

export const fetchDisplaysFailure = error => ({
    type: "FETCH_DISPLAYS_FAILURE",
    payload: { error }
})

export const fetchDisplays = skill_id => {
    return dispatch => {
        dispatch(beginFetchDisplays())
        return axios.get(`/multimodal/displays?skill_id=${skill_id}`).then(res => {
            let displays = res.data.map(t => {
                return {
                    title: t.title,
                    display_id: t.id,
                    document: t.document,
                    description: t.description,
                    datasource: t.datasource
                }
            })
            dispatch(setDisplays(displays))
        })
        .catch(err => {
            console.error(err.response);
            dispatch(fetchDisplaysFailure('Could Not Retreieve Displays'))
        })
    }
}

export const deleteDisplay = (display_id) => {
    return dispatch => {
        return axios.delete(`/multimodal/display/${display_id}`).then(() => {
            dispatch(removeDisplay(display_id))
        })
    }
}

export const FETCH_DISPLAY_BEGIN = 'FETCH_DISPLAY_BEGIN'
export const SET_DISPLAYS = 'SET_DISPLAYS'
export const ADD_DISPLAY = 'ADD_DISPLAY'
export const REMOVE_DISPLAY = 'REMOVE_DISPLAY'
export const FETCH_DISPLAYS_FAILURE = 'FETCH_DISPLAYS_FAILURE'