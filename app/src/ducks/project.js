import axios from 'axios'
import { setError } from 'ducks/modal'
import { fetchLiveVersion, updateVersion } from 'ducks/version'
import Normalize from 'ducks/_normalize'
import { addProjectToList } from './board'

export const UPDATE_PROJECTS = 'UPDATE_PROJECTS'
export const RESET_PROJECTS = 'RESET_PROJECTS'

const initialState = {
  byId: {},
  allIds: []
}

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PROJECTS:
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds
      }
    case RESET_PROJECTS:
      return initialState
    default:
      return state
  }
}

export const updateProjects = ({byId, allIds}) => ({
  type: UPDATE_PROJECTS,
  payload: { byId, allIds }
})

const Projects = new Normalize('project_id', 'project', updateProjects)

export const resetProjects = () => ({
  type: RESET_PROJECTS
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
      dispatch(Projects.create({data: projects}))
      return Promise.resolve()
    }catch(err){
      console.error(err)
      dispatch(setError('Unable to retrieve projects'))
    }
  }
}

export const copyProject = (project_id, team_id, board_id) => {
  return async (dispatch, getState) => {
    try{
      const projects = getState().project
      const project = projects.byId[project_id]
      if(!project) throw new Error()

      let new_project = (await axios.post(`/version/${project.skill_id}/copy/team/${team_id}`)).data
      if (board_id) dispatch(addProjectToList(board_id, new_project.project_id))
      dispatch(Projects.add({data: new_project}))
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
      dispatch(Projects.delete({id: project_id}))
    }catch(err){
      dispatch(setError('Problem deleting project'))
      console.error(err)
    }
  }
}

export const updateVendorId = (project_id, vendor_id) => {
  return async (dispatch) => {
    try {
      const amzn_id = (await axios.post(`/project/${project_id}/vendor_id`, {vendor_id})).data
      await dispatch(updateVersion('amzn_id', amzn_id || null))
      await dispatch(updateVersion('vendor_id', vendor_id))
      await dispatch(fetchLiveVersion(project_id, amzn_id))
    } catch (err) {
      dispatch(setError('Unable to update Vendor Id'))
      console.error(err)
    }
  }
}

// export const reorderProjects = (dragIndex, hoverIndex) => {
//   return async (dispatch, getState) => {
//     try{
//       const projects = getState().project.allIds
//       const drag = projects[dragIndex]

//       projects.splice(dragIndex, 1)
//       projects.splice(hoverIndex, 0, drag)

//       dispatch(updateProjects(projects))
//     } catch(err){
//       console.error(err)
//       dispatch(setError('Unable to reorder pojects'))
//       return Promise.reject()
//     }
//     return Promise.resolve()
//   }
// }