import axios from 'axios';

export const fetchDiagramVariablesBegin = () => ({
  type: "FETCH_DIAGRAM_VARIABLES_BEGIN"
});

export const fetchDiagramVariablesSuccess = diagramVariables => ({
  type: "FETCH_DIAGRAM_VARIABLES_SUCCESS",
  payload: { diagramVariables }
});

export const fetchDiagramVariableBlocked = message => ({
    type: "FETCH_DIAGRAM_VARIABLES_BLOCKED",
    payload: { message }
})

export const fetchDiagramVariablesFailure = error => ({
  type: "FETCH_DIAGRAM_VARIABLE_FAILURE",
  payload: { error }
});


export const fetchDiagramVariables = diagram_id => {
    return dispatch => {
        dispatch(fetchDiagramVariablesBegin());
        return axios.get(`/diagram/${diagram_id}/variables`)
            .then(res => {
                if (Array.isArray(res.data)) {
                    dispatch(fetchDiagramVariablesSuccess(res.data))
                }
            })
            .catch(err => {
                console.error(err);
                dispatch(fetchDiagramVariablesFailure(true))
            });
    }
}


export const FETCH_DIAGRAM_VARIABLES_BEGIN = 'FETCH_DIAGRAM_VARIABLES_BEGIN';
export const FETCH_DIAGRAM_VARIABLES_SUCCESS = 'FETCH_DIAGRAM_VARIABLES_SUCCESS';
export const FETCH_DIAGRAM_VARIABLES_FAILURE = 'FETCH_DIAGRAM_VARIABLES_FAILURE';
export const FETCH_DIAGRAM_VARIABLES = 'FETCH_DIAGRAM_VARIABLES';