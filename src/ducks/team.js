import axios from 'axios'
import { setError } from 'ducks/modal'
import NORMALIZE, { normalize, deleteNormalize } from 'ducks/util'

const initialState = {
  team_id: localStorage.getItem('team'),
  byId: {},
  allIds: []
}

// Reducer
export default function teamReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CURRENT_TEAM':
      localStorage.setItem('team', action.payload)
      return {
        ...state,
        team_id: action.payload
      }
    case 'UPDATE_TEAMS':
      return {
        ...state,
        byId: action.payload.byId,
        allIds: action.payload.allIds
      }
    default:
      return state
  }
}

const updateTeams = ({byId, allIds}) => ({
  type: 'UPDATE_TEAMS',
  payload: { byId, allIds }
})

const TEAM = NORMALIZE('team_id', 'team', updateTeams)

export const updateTeam = (team_id, data) => {
  return async dispatch => {
    dispatch(TEAM('update', {id: team_id, data: data}))
  }
}

export const getMembers = team_id => {
  return async (dispatch) => {
    try {
      let members = (await axios.get(`/team/${team_id}/members`)).data
      dispatch(TEAM('update', {id: team_id, data: {members}}))
    } catch(err) {
      console.error(err)
      dispatch(setError("Unable to retrieve members"))
    }
  }
}

export const updateCurrentTeam = team_id => {
  return async (dispatch, getStore) => {
    if(team_id in getStore().team.byId){
      dispatch({
        type: "UPDATE_CURRENT_TEAM",
        payload: team_id
      })
      dispatch(getMembers(team_id))
    }
  }
}

export const updateCurrentTeamItem = (payload) => {
  return (dispatch, getStore) => {
    let team_id = getStore().team.team_id
    if (team_id) {
      dispatch(updateTeam(team_id, payload))
    }
  }
}

export const deleteTeam = team_id => {
  return async (dispatch, getState) => {
    try{
      await axios.delete(`/team/${team_id}`)

      let teams = getState().team
      const state = deleteNormalize(team_id, teams)
      // default to the first existing team
      let new_team = state.allIds.length > 0 ? state.allIds[0] : undefined
      dispatch(updateCurrentTeam(new_team))
      dispatch(updateTeams(state))
    }catch(err){
      console.error(err)
      dispatch(setError("Unable to delete team"))
      return Promise.reject()
    }
    return Promise.resolve()
  }
}

export const fetchTeams = () => {
  return async (dispatch, getState) => {
    try{
      let res = await axios.get('/teams')
      
      // NORMALIZE TEAMS
      const state = normalize('team_id', res.data.map(t => {
        t.members = []
        return t
      }))

      // If the current team doesn't exist, default it to something else
      if(!(getState().team.team_id in state.byId)){
        let new_team = state.allIds.length > 0 ? state.allIds[0] : undefined
        dispatch(updateCurrentTeam(new_team))
      }
      dispatch(updateTeams(state))
      return Promise.resolve()
    }catch(err){
      dispatch(setError("Unable to fetch workspaces"))
      console.error(err)
    }
  }
}