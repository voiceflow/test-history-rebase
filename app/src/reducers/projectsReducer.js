import { cloneDeep } from 'lodash'

const initialState = {
  team_id: localStorage.getItem('team') || -1,
  loading: true,
  teams: [],
  projects: []
}

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_CURRENT_TEAM':
      localStorage.setItem('team', action.payload)
      return {
        ...state,
        team_id: action.payload
      }
    case 'UPDATE_TEAMS':
      if(!Array.isArray(action.payload)) return state
      return {
        ...state,
        teams: cloneDeep(action.payload)
      }
    case 'UPDATE_PROJECTS':
      if(!Array.isArray(action.payload)) return state
      return {
        ...state,
        projects: cloneDeep(action.payload),
        loading: false
      }
    case 'RESET_PROJECTS':
      return {
        ...state,
        projects: [],
        loading: true
      }
    default:
      return state
  }
}