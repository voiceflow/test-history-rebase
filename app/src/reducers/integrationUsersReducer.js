import {
  FETCH_INTEGRATION_USERS_BEGIN,
  FETCH_INTEGRATION_USERS_SUCCESS,
  FETCH_INTEGRATION_USERS_FAILURE,
  ADD_INTEGRATION_USER_BEGIN,
  ADD_INTEGRATION_USER_SUCCESS,
  ADD_INTEGRATION_USER_FAILURE,
  DELETE_INTEGRATION_USER_BEGIN,
  DELETE_INTEGRATION_USER_SUCCESS,
  DELETE_INTEGRATION_USER_FAILURE
} from '../actions/integrationUsersActions';

const initialState = {
  integration_users: {},
  loading: false,
  error: null
}

export default function skillReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_INTEGRATION_USERS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_INTEGRATION_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_users: action.payload.integration_users
      }
    case FETCH_INTEGRATION_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        integration_users: {},
      }
    case ADD_INTEGRATION_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ADD_INTEGRATION_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_users: action.payload.new_integration_users
      }
    case ADD_INTEGRATION_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    case DELETE_INTEGRATION_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      }
    case DELETE_INTEGRATION_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_users: action.payload.new_integration_users
      }
    case DELETE_INTEGRATION_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    default:
      return state
  }
}