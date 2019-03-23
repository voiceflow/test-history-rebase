import axios from 'axios'
// import _ from 'lodash'

export const resetProjects = () => ({
  type: "RESET_PROJECTS"
})

export const updateTeam = team => {
  return async (dispatch, getState) => {
    if(team !== getState().projects.team){
      dispatch({
        type: "UPDATE_TEAM",
        payload: team
      })
      dispatch(fetchProjects(team))
    }
  }
}

export const updateProjects = projects => ({
  type: 'UPDATE_PROJECTS',
  payload: projects
})

export const updateTeams = teams => ({
  type: 'UPDATE_TEAMS',
  payload: teams
})

export const fetchTeams = () => {
  return async dispatch => {
    try{
      let res = await axios.get('/teams')
      dispatch(updateTeams(res.data))
      return Promise.resolve()
    }catch(err){
      console.error(err)
    }
  }
}

export const fetchProjects = team_id => {
  return async dispatch => {
    dispatch(resetProjects())
    try{
      let url = `/projects`
      if(team_id !== -1) url = `/team/${team_id}/skills`
      let res = await axios.get(url)
      dispatch(updateProjects(res.data))
      return Promise.resolve()
    }catch(err){
      console.error(err)
    }
  }
}

export const copyProject = project_id => {
  return async (dispatch, getState) => {
    try{
      let res = await axios.post(`/skill/${project_id}/${window.user_detail.id}/copy`)
      let projects = getState().projects.projects
      projects.push(res.data)
      dispatch(updateProjects(projects))
    }catch(err){
      console.error(err)
    }
    return Promise.resolve()
  }
}

export const deleteProject = project_id => {
  return async (dispatch, getState) => {
    try{
      await axios.delete(`/projects/${project_id}`)
      let projects = getState().projects.projects
      projects = projects.filter(s => s.skill_id !== project_id)
      dispatch(updateProjects(projects))
    }catch(err){
      console.error(err)
    }
  }
}