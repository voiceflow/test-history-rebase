/* eslint no-restricted-globals: ["error", "isFinite"] */
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

import { toast } from '@/components/Toast';

export const SET_CREATOR = 'SET_CREATOR';
export const FIND_CREATOR_FAILED = 'FIND_CREATOR_FAILED';
export const SET_CHARGES = 'SET_CHARGES';
export const SET_VENDORS = 'SET_VENDORS';
export const SET_BETA_CREATOR = 'SET_BETA_CREATOR';
export const CLEAR_BETA_CREATOR = 'CLEAR_BETA_CREATOR';
export const SET_ALL_BETA_USERS = 'SET_ALL_BETA_USERS';
export const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE';

export const TOGGLE_THEME = 'TOGGLE_THEME';
export const THEMES = {
  light: 'LIGHT',
  dark: 'DARK',
  unicorn: 'UNICORN',
};

export const ADMIN_INITIAL_STATE = {
  // The current creator being searched
  creator: {},
  betaCreator: {},
  boards: [],
  charges: [],
  vendors: [],
  error: {
    errorMessage: '',
    errorReturned: null,
  },
  dark: false,
  theme: THEMES.light,
};

export default function adminReducer(state = ADMIN_INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_WORKSPACE:
      return {
        ...state,
        boards: state.boards.map((board) =>
          board.team_id === action.payload.id
            ? {
                ...board,
                ...action.payload.data,
              }
            : board
        ),
      };
    case SET_CREATOR:
      return {
        ...state,
        creator: action.payload.creator,
        boards: action.payload.boards,
      };
    case FIND_CREATOR_FAILED:
      return {
        ...state,
        error: action.payload,
      };
    case SET_CHARGES:
      return {
        ...state,
        charges: action.payload,
      };
    case SET_VENDORS:
      return {
        ...state,
        vendors: action.payload,
      };
    case SET_BETA_CREATOR:
      return {
        ...state,
        betaCreator: action.payload.creator,
      };
    case CLEAR_BETA_CREATOR:
      return {
        ...state,
        betaCreator: {},
      };
    case TOGGLE_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    default:
      return state;
  }
}

export const toggleTheme = (theme) => {
  return {
    type: TOGGLE_THEME,
    theme,
  };
};

export const findBetaCreator = (creatorEmail) => async (dispatch) => {
  if (!creatorEmail) {
    dispatch({ type: FIND_CREATOR_FAILED, payload: { errorMessage: 'No creator info given' } });
  }

  try {
    const response = await axios.get(`/admin-api/email/${creatorEmail}`);
    dispatch({
      type: SET_BETA_CREATOR,
      payload: {
        creator: response.data.creator,
      },
    });
  } catch (err) {
    toast.error('Error finding beta user');
  }
};

export const clearBetaCreator = () => ({
  type: CLEAR_BETA_CREATOR,
});

export const getBetaUsers = () => async (dispatch) => {
  try {
    const response = await axios.get();
    dispatch({
      type: SET_ALL_BETA_USERS,
      payload: {
        users: response.data.users,
      },
    });
  } catch (err) {
    toast.error('There was an error finding the beta user list');
  }
};

// Find the creator based on their id or email
export const findCreator = (creatorInfo) => async (dispatch) => {
  if (!creatorInfo) {
    dispatch({ type: FIND_CREATOR_FAILED, payload: { errorMessage: 'No creator info given' } });
  }

  try {
    // Get the user object based on whether it is by creator id or by email
    let response;
    if (isNaN(creatorInfo)) {
      response = await axios.get(`/admin-api/email/${creatorInfo}`);
    } else {
      response = await axios.get(`/admin-api/${creatorInfo}`);
    }
    // Set our creator object as well as their boards in the reducer
    dispatch({
      type: SET_CREATOR,
      payload: {
        creator: response.data.creator,
        boards: _.values(response.data.boards),
      },
    });
  } catch (err) {
    // Handle the error
    toast.error('Error fetching creator');
    dispatch({
      type: FIND_CREATOR_FAILED,
      payload: {
        errorMessage: 'Could not find user, something went wrong',
        errorReturned: err,
      },
    });
  }
};

export const getCharges = (creatorInfo) => async (dispatch) => {
  if (!creatorInfo) {
    return;
  }

  let creatorId;

  if (isNaN(creatorInfo)) {
    const response = await axios.get(`/admin-api/email/${creatorInfo}`);
    creatorId = response.data.creator.creator_id;
    dispatch({
      type: SET_CREATOR,
      payload: {
        creator: response.data.creator,
        boards: _.values(response.data.boards),
      },
    });
  } else {
    creatorId = creatorInfo;
  }

  try {
    const response = await axios.get(`/admin-api/charges/${creatorId}`);
    dispatch({
      type: SET_CHARGES,
      payload: response.data.teams,
    });
    toast.success('Charges found for user');
  } catch (err) {
    toast.error('Fetch charges failed');
    console.error('Error when getting charges for user: ', err);
  }
};

export const getVendors = (creatorInfo) => async (dispatch) => {
  if (!creatorInfo) {
    return;
  }

  let creatorId;

  if (isNaN(creatorInfo)) {
    const response = await axios.get(`/admin-api/email/${creatorInfo}`);
    creatorId = response.data.creator.creator_id;
    dispatch({
      type: SET_CREATOR,
      payload: {
        creator: response.data.creator,
        boards: _.values(response.data.boards),
      },
    });
  } else {
    creatorId = creatorInfo;
  }

  try {
    const response = await axios.get(`/admin-api/vendors/${creatorId}`);
    dispatch({
      type: SET_VENDORS,
      payload: response.data.vendors,
    });
    toast.success('Vendors found for user');
  } catch (err) {
    toast.error('Fetch vendors failed');
    console.error('Error when getting vendors for user: ', err);
  }
};

export const editTrial = (workspaceID, date) => async () => {
  if (!workspaceID) {
    return;
  }

  try {
    if (date) {
      // Date should be a timestamp (something like 1429482798)
      // Add one extra day to account for reset at midnight
      const formatDate = moment(date)
        .add(1, 'd')
        .unix();
      axios.post(`/admin-api/trial/${workspaceID}/${formatDate}`);
    } else {
      // We want to set the trial expiry to null here
      axios.post(`/admin-api/trial/${workspaceID}/${0}`);
    }
    toast.success("Trial period set! Please refresh the page to see updated charges'");
  } catch (err) {
    toast.error('Trail edit failed.');
  }
};

// Refund a specific user
export const refundCharge = (workspaceID, chargeId, chargeAmount) => async () => {
  if (!workspaceID || !chargeId || !chargeAmount) {
    return;
  }

  try {
    await axios.post(`/admin-api/refund/${workspaceID}/${chargeId}/${chargeAmount}`);
    toast.success('Refund successful! Please refresh the page to see updated charges');
  } catch (err) {
    console.error('error when refunding user: ', err);
    toast.error('Refund failed.');
  }
};

// Cancel a user's subscription
export const cancelSubscription = (workspaceID, subscriptionId) => async () => {
  if (!workspaceID || !subscriptionId) {
    return;
  }

  try {
    await axios.post(`/admin-api/cancel/${workspaceID}/${subscriptionId}`);
    toast.success('Subscription cancelled! Refresh to see updated results');
  } catch (err) {
    console.error('error from cancelling subscription', err);
    toast.error('Cancel Subscription Failed');
  }
};

export const updateWorkspace = (workspaceID, data) => async (dispatch) => {
  if (!workspaceID) return toast.error('Workspace not found');

  try {
    // Add one extra day to account for reset at midnight
    await axios.patch(`/admin-api/workspace/${workspaceID}`, data);

    dispatch({
      type: UPDATE_WORKSPACE,
      payload: {
        id: workspaceID,
        data,
      },
    });
    toast.success(`Workspace ${Object.keys(data).join(', ')} updated`);
  } catch (err) {
    toast.error('Failed to set the plan.');
  }
};
