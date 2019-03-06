import axios from 'axios';

export const fetchDiagramBegin = () => ({
  type: "FETCH_DIAGRAM_BEGIN"
});

export const fetchDiagramsSuccess = diagrams => ({
  type: "FETCH_DIAGRAMS_SUCCESS",
  payload: { diagrams }
});

export const fetchDiagramSuccess = success => ({
    type: "FETCH_DIAGRAM_SUCCESS",
    payload: { success }
})
export const fetchDiagramBlocked = message => ({
    type: "FETCH_DIAGRAM_BLOCKED",
    payload: { message }
})

export const fetchDiagramFailure = error => ({
  type: "FETCH_DIAGRAM_FAILURE",
  payload: { error }
});

export const onFlowRename = flow_id => ({
    type: "ON_FLOW_RENAME",
    payload: {flow_id}
})

export const fetchDiagram = skill_id => {
    return dispatch => {
        dispatch(fetchDiagramBegin());
        return axios.get('/skill/' + skill_id + '/diagrams')
            .then(res => {
                dispatch(fetchDiagramsSuccess(res.data.map(flow => {
                    try {
                        return {
                            id: flow.id,
                            name: flow.name,
                            sub_diagrams: JSON.parse(flow.sub_diagrams)
                        }
                    } catch (err) {
                        return {
                            id: flow.id,
                            name: flow.name
                        }
                    }
                })))
            })
            .catch(err => {
                console.error(err.response)
                dispatch(fetchDiagramFailure('Could Not Retrieve Project Diagrams'))
            })
    }
}

export const renameDiagram = (flow_id, name) => {
    return (dispatch, getState) => {
        name = name.trim();
        let index = getState().diagrams.diagrams.findIndex(d => d.id === flow_id);
        if (index !== -1){
            let flow = getState().diagrams.diagrams.find(d => d.name === name)
            if (flow && flow.name !== name) {
                return this.props.onConfirm({
                    text: 'Flow names must be unique',
                    confirm: () => this.setState({
                        confirm: null
                    })
                })
            }
            return axios.post(`/diagram/${flow_id}/name`, {
                name: name
            })
            .then(() => {
                dispatch(onFlowRename(flow_id))
            })
            .catch(err => {
                alert('Error - Name not Updated')
            })
        }
    }
}

export const FETCH_DIAGRAM_BEGIN = 'FETCH_DIAGRAM_BEGIN';
export const FETCH_DIAGRAMS_SUCCESS = 'FETCH_DIAGRAMS_SUCCESS';
export const FETCH_DIAGRAM_SUCCESS = 'FETCH_DIAGRAM_SUCCESS'
export const FETCH_DIAGRAM_FAILURE = 'FETCH_DIAGRAM_FAILURE';
export const FETCH_DIAGRAM = 'FETCH_DIAGRAM';
export const RENAME_DIAGRAM = 'RENAME_DIAGRAM'