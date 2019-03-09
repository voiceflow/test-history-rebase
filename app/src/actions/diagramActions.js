import axios from 'axios';

export const fetchDiagramsBegin = () => ({
  type: "FETCH_DIAGRAMS_BEGIN"
});

export const fetchDiagramsSuccess = diagrams => ({
  type: "FETCH_DIAGRAMS_SUCCESS",
  payload: { diagrams }
});

export const fetchDiagramsFailure = error => ({
  type: "FETCH_DIAGRAMS_FAILURE",
  payload: { error }
});

export const onFlowRename = (flow_id, name)=> ({
    type: "ON_FLOW_RENAME",
    payload: {flow_id, name}
})

export const fetchDiagrams = skill_id => {
    return dispatch => {
      dispatch(fetchDiagramsBegin());
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
          dispatch(fetchDiagramsFailure('Could Not Retrieve Project Diagrams'))
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
                dispatch(onFlowRename(flow_id, name))
            })
            .catch(err => {
                alert('Error - Name not Updated')
            })
        }
    }
}

export const FETCH_DIAGRAMS_BEGIN = 'FETCH_DIAGRAMS_BEGIN';
export const FETCH_DIAGRAMS_SUCCESS = 'FETCH_DIAGRAMS_SUCCESS';
export const FETCH_DIAGRAMS_FAILURE = 'FETCH_DIAGRAMS_FAILURE';
export const FETCH_DIAGRAM = 'FETCH_DIAGRAM';
export const ON_FLOW_RENAME = 'ON_FLOW_RENAME'