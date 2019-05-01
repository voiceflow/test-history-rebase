import axios from 'axios'
import { setError } from 'ducks/modal'
import Normalize, { normalize, deleteNormalize } from 'ducks/_normalize'

export const INVALID_STATES = ["incomplete_expired", "incomplete", "unpaid"]
export const WARNING_STATES = ["past_due"]

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

const Teams = new Normalize('team_id', 'team', updateTeams)

export const updateTeam = (team_id, data) => {
  return async dispatch => {
    dispatch(Teams.update({id: team_id, data: data}))
  }
}

export const getMembers = team_id => {
  return async (dispatch) => {
    try {
      let members = (await axios.get(`/team/${team_id}/members`)).data
      dispatch(Teams.update({id: team_id, data: {members}}))
      Promise.resolve()
    } catch(err) {
      console.error(err)
      dispatch(setError("Unable to retrieve members"))
      Promise.reject()
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

export const leaveTeam = team_id => {
  return async (dispatch, getState) => {
    try {
      const store = getState()
      await axios.delete(`/team/${team_id}/member/${store.account.creator_id}`)

      const state = deleteNormalize(team_id, store.team)
      // default to the first existing team
      let new_team = state.allIds.length > 0 ? state.allIds[0] : undefined
      dispatch(updateCurrentTeam(new_team))
      dispatch(updateTeams(state))
    } catch (err) {
      dispatch(setError((err && err.response && err.response.data) || (err && JSON.stringify(err)) || 'Unable to Update Members'))
      return Promise.reject()
    }
  }
}

export const fetchTeams = () => {
  return async (dispatch, getState) => {
    try{
      let res = await axios.get('/teams')

      // NORMALIZE TEAMS
      const state = normalize('team_id', res.data.map(t => {
        t.members = [];
        
        if(t.expiry) t.expiry = new Date(t.expiry)

        if (INVALID_STATES.includes(t.stripe_status)) {
          t.state = "LOCKED"
        } else if (WARNING_STATES.includes(t.stripe_status)) {
          t.state = "WARNING"
        } else if (t.expiry && Date.now() > t.expiry.getTime()) {
          t.state = "EXPIRED"
        }
        return t
      }))

      // If the current team doesn't exist, default it to something else
      dispatch(updateTeams(state))

      if(!(getState().team.team_id in state.byId)){
        let new_team = state.allIds.length > 0 ? state.allIds[0] : undefined
        dispatch(updateCurrentTeam(new_team))
      }

      return Promise.resolve()
    }catch(err){
      dispatch(setError("Unable to fetch boards"))
      console.error(err)
      return Promise.reject()
    }
  }
}

export const createTeam = data => {
  return async dispatch => {
    try {
      var team
      if(data.source) {
        // creating the team from a paid source
        team = (await axios.post("/team/checkout", data)).data
      }else{
        // creating a free tier team
        team = (await axios.post("/team", data)).data;
      }

      return Promise.resolve(team)
    } catch (err) {
      dispatch(setError((err && err.response && err.response.data) || (err && JSON.stringify(err)) || 'Unable to Update Members'))
      return Promise.reject()
    }
  }
}

export const updateMembers = (new_members, options) => {
  return async (dispatch, getState) => {
    try {
      const team = (await axios.patch(`/team/${getState().team.team_id}/members`, {
        ...options,
        members: new_members.map(m => {
          // switch invite field to email field
          return {
            ...m,
            email: m.invite || m.email
          }
        })
      })).data

      dispatch(updateCurrentTeamItem(team))

      return Promise.resolve()
    }catch(err){
      dispatch(setError((err && err.response && err.response.data) || (err && JSON.stringify(err)) || 'Unable to Update Members'))
      return Promise.reject()
    }
  }
}

export const teamInvite = (invite) => {
  return async (dispatch) => {
    let team_id
    try {
      team_id = (await axios.post(`/team/invite/${invite}`)).data
      dispatch({
        type: "UPDATE_CURRENT_TEAM",
        payload: team_id
      })
    }catch(err){
      dispatch(setError((err && err.response && err.response.data) || (err && JSON.stringify(err)) || 'Invite Invalid'))
    }
    return Promise.resolve(team_id)
  }
}