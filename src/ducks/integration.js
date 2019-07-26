import axios from 'axios';

export const FETCH_INTEGRATION_USERS_BEGIN = 'FETCH_INTEGRATION_USERS_BEGIN';
export const FETCH_INTEGRATION_USERS_SUCCESS = 'FETCH_INTEGRATION_USERS_SUCCESS';
export const FETCH_INTEGRATION_USERS_FAILURE = 'FETCH_INTEGRATION_USERS_FAILURE';
export const ADD_INTEGRATION_USER_BEGIN = 'ADD_INTEGRATION_USER_BEGIN';
export const ADD_INTEGRATION_USER_SUCCESS = 'ADD_INTEGRATION_USER_SUCCESS';
export const ADD_INTEGRATION_USER_FAILURE = 'ADD_INTEGRATION_USER_FAILURE';
export const DELETE_INTEGRATION_USER_BEGIN = 'DELETE_INTEGRATION_USER_BEGIN';
export const DELETE_INTEGRATION_USER_SUCCESS = 'DELETE_INTEGRATION_USER_SUCCESS';
export const DELETE_INTEGRATION_USER_FAILURE = 'DELETE_INTEGRATION_USER_FAILURE';

const initialState = {
  integration_users: {},
  loading: false,
  error: null,
};

export default function skillReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_INTEGRATION_USERS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_INTEGRATION_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_users: action.payload.integration_users,
      };
    case FETCH_INTEGRATION_USERS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        integration_users: {},
      };
    case ADD_INTEGRATION_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ADD_INTEGRATION_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_users: action.payload.new_integration_users,
      };
    case ADD_INTEGRATION_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    case DELETE_INTEGRATION_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case DELETE_INTEGRATION_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        integration_users: action.payload.new_integration_users,
      };
    case DELETE_INTEGRATION_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
}

export const fetchIntegrationUsersBegin = () => ({
  type: FETCH_INTEGRATION_USERS_BEGIN,
});

export const fetchIntegrationUsersFailure = (error) => ({
  type: FETCH_INTEGRATION_USERS_FAILURE,
  payload: { error },
});

export const fetchIntegrationUsersSuccess = (integration_users) => ({
  type: FETCH_INTEGRATION_USERS_SUCCESS,
  payload: { integration_users },
});

export const fetchIntegrationUsers = () => {
  return async (dispatch) => {
    dispatch(fetchIntegrationUsersBegin());
    try {
      const resp = await axios.post('/integrations/get_users');
      const dictByPlatform = {};
      resp.data.forEach((user) => {
        if (!dictByPlatform[user.platform]) dictByPlatform[user.platform] = [];
        dictByPlatform[user.platform].push(user);
      });
      dispatch(fetchIntegrationUsersSuccess(dictByPlatform));
    } catch (e) {
      dispatch(fetchIntegrationUsersFailure(e));
      throw e;
    }
  };
};

export const addIntegrationUserBegin = () => ({
  type: ADD_INTEGRATION_USER_BEGIN,
});

export const addIntegrationUserSuccess = (new_integration_users) => ({
  type: ADD_INTEGRATION_USER_SUCCESS,
  payload: { new_integration_users },
});

export const addIntegrationUserFailure = (error) => ({
  type: ADD_INTEGRATION_USER_FAILURE,
  payload: { error },
});

export const addIntegrationUser = (integration, body) => {
  return async (dispatch) => {
    dispatch(addIntegrationUserBegin());
    try {
      const resp = await axios.post('/integrations/add_user', {
        integration,
        ...body,
      });
      const dictByPlatform = {};
      resp.data.forEach((user) => {
        if (!dictByPlatform[user.platform]) dictByPlatform[user.platform] = [];
        dictByPlatform[user.platform].push(user);
      });
      dispatch(addIntegrationUserSuccess(dictByPlatform));
      return dictByPlatform;
    } catch (e) {
      dispatch(addIntegrationUserFailure(e));
      throw e;
    }
  };
};

export const deleteIntegrationUserBegin = () => ({
  type: DELETE_INTEGRATION_USER_BEGIN,
});

export const deleteIntegrationUserSuccess = (new_integration_users) => ({
  type: DELETE_INTEGRATION_USER_SUCCESS,
  payload: { new_integration_users },
});

export const deleteIntegrationUserFailure = (error) => ({
  type: DELETE_INTEGRATION_USER_FAILURE,
  payload: { error },
});

export const deleteIntegrationUser = (integration, body) => {
  return async (dispatch) => {
    dispatch(deleteIntegrationUserBegin());
    try {
      const resp = await axios.post('/integrations/delete_user', {
        integration,
        ...body,
      });
      const dictByPlatform = {};
      resp.data.forEach((user) => {
        if (!dictByPlatform[user.platform]) dictByPlatform[user.platform] = [];
        dictByPlatform[user.platform].push(user);
      });
      dispatch(deleteIntegrationUserSuccess(dictByPlatform));
    } catch (e) {
      dispatch(deleteIntegrationUserFailure(e));
      throw e;
    }
  };
};
