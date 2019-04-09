import axios from 'axios';
import _ from 'lodash';
import { setConfirm } from './modalActions'

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

export const updateDiagramRoot = (root_id)=> ({
  type: "UPDATE_DIAGRAM_ROOT",
  payload: {root_id}
})

export const appendDiagrams = diagrams => ({
  type: "APPEND_DIAGRAMS",
  payload: {diagrams}
})

export const replaceDiagrams = diagrams => ({
  type: "REPLACE_DIAGRAMS",
  payload: {diagrams}
})

export const fetchDiagrams = skill_id => {
    return dispatch => {
      dispatch(fetchDiagramsBegin());
      return axios.get('/skill/' + skill_id + '/diagrams')
        .then(res => {
          let diagrams = res.data.map(flow => {
              try {
                  return {
                      id: flow.id,
                      name: flow.name,
                      sub_diagrams: JSON.parse(flow.sub_diagrams),
                      module_id: flow.module_id
                  }
              } catch (err) {
                  return {
                      id: flow.id,
                      name: flow.name
                  }
              }
          })
          
          if(diagrams.length === 0) throw new Error("No Diagrams Associated With this Skill")

          let root = _.find(diagrams, d => d.name === 'ROOT')
          if(!root){
            diagrams[0].name = 'ROOT'
            root=diagrams[0]
            dispatch(renameDiagram(root.id, 'ROOT'))
          }
          dispatch(updateDiagramRoot(root.id))
          dispatch(fetchDiagramsSuccess(diagrams))
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
                return dispatch(setConfirm({
                    text: 'Flow names must be unique',
                    confirm: () => this.setState({
                        confirm: null
                    })
                }))
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

export const FETCH_DIAGRAMS_BEGIN = 'FETCH_DIAGRAMS_BEGIN'
export const FETCH_DIAGRAMS_SUCCESS = 'FETCH_DIAGRAMS_SUCCESS'
export const FETCH_DIAGRAMS_FAILURE = 'FETCH_DIAGRAMS_FAILURE'
export const FETCH_DIAGRAM = 'FETCH_DIAGRAM'
export const ON_FLOW_RENAME = 'ON_FLOW_RENAME'
export const UPDATE_DIAGRAM_ROOT = 'UPDATE_DIAGRAM_ROOT'
export const APPEND_DIAGRAMS = 'APPEND_DIAGRAMS'
export const REPLACE_DIAGRAMS = 'REPLACE_DIAGRAMS'