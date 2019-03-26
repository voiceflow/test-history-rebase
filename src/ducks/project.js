import axios from 'axios'
import { setError } from 'ducks/modal'
import NORMALIZE from 'ducks/util'

const initialState = {
  loading: true,
  byId: {},
  allIds: []
}

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_PROJECTS':
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds,
        loading: false
      }
    case 'RESET_PROJECTS':
      return {
        ...state,
        byId: {},
        allIds: [],
        loading: true
      }
    default:
      return state
  }
}

const updateProjects = ({byId, allIds}) => ({
  type: 'UPDATE_PROJECTS',
  payload: { byId, allIds }
})

const PROJECT = NORMALIZE('project_id', 'project', updateProjects)

export const resetProjects = () => ({
  type: "RESET_PROJECTS"
})

export const fetchProjects = team_id => {
  return async dispatch => {
    dispatch(resetProjects())
    if(!team_id) return

    try{
      let url = `/projects`
      if(team_id !== -1) url = `/team/${team_id}/projects`
      let projects = (await axios.get(url)).data
      // NORMALIZE
      dispatch(PROJECT('create', {data: projects}))
      return Promise.resolve()
    }catch(err){
      console.error(err)
      dispatch(setError('Unable to retrieve projects'))
    }
  }
}

export const copyProject = (project_id, team_id) => {
  return async (dispatch, getState) => {
    try{
      const projects = getState().project
      const project = projects.byId[project_id]
      if(!project) throw new Error()

      let new_project = (await axios.post(`/version/${project.skill_id}/copy/team/${team_id}`)).data

      dispatch(PROJECT('add', {data: new_project}))
    }catch(err){
      console.error(err)
      dispatch(setError('Unable to copy project'))
      return Promise.reject()
    }
    return Promise.resolve()
  }
}

export const deleteProject = project_id => {
  return async (dispatch) => {
    try{
      await axios.delete(`/projects/${project_id}`)
      dispatch(PROJECT('delete', {id: project_id}))
    }catch(err){
      dispatch(setError('Problem deleting project'))
      console.error(err)
    }
  }
}