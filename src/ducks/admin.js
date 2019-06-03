import axios from 'axios';
import _ from "lodash";
import {toast} from 'react-toastify';

export const SET_CREATOR = 'SET_CREATOR';
export const FIND_CREATOR_FAILED = 'FIND_CREATOR_FAILED';
export const SET_CHARGES = 'SET_CHARGES';

const initialState = {
  // The current creator being searched
  creator: {},
  boards: [],
  charges: [],
  error: {
    errorMessage: '',
    errorReturned: null
  }
};

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CREATOR:
      return {
        ...state,
        creator: action.payload.creator,
        boards: action.payload.boards
      };
    case FIND_CREATOR_FAILED:
      return {
        ...state,
        error: action.payload
      };
    case SET_CHARGES:
      return {
        ...state,
        charges: action.payload
      };
    default:
      return state;
  }
}

// Find the creator based on their id or email
export const findCreator = creatorInfo => async dispatch => {

  if (!creatorInfo) {
    dispatch({type: FIND_CREATOR_FAILED, payload: {errorMessage: 'No creator info given'}});
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
      }
    })
  } catch (err) {
    // Handle the error
    toast.error('Error fetching creator');
    dispatch({
      type: FIND_CREATOR_FAILED,
      payload: {
        errorMessage: 'Could not find user, something went wrong',
        errorReturned: err
      }
    })
  }
};

export const getCharges = creatorInfo => async dispatch => {

  if (!creatorInfo) {
    return;
  }

  let creatorId;

  if (isNaN(creatorInfo)) {
    let response = await axios.get(`/admin-api/email/${creatorInfo}`);
    creatorId = response.data.creator.creator_id;
    dispatch({
      type: SET_CREATOR,
      payload: {
        creator: response.data.creator,
        boards: _.values(response.data.boards),
      }
    })
  } else {
    creatorId = creatorInfo;
  }

  try {
    let response = await axios.get(`/admin-api/charges/${creatorId}`);
    dispatch({
      type: SET_CHARGES,
      payload: response.data.teams
    });
    toast.success('Charges found for user')
  } catch (err) {
    toast.error('Fetch charges failed');
    console.error('Error when getting charges for user ', err);
  }

};

// Refund a specific user
export const refundCharge = (teamId, chargeId, chargeAmount) => async dispatch => {

  if (!teamId || !chargeId || !chargeAmount) {
    return;
  }
  
  try {
    await axios.post(`/admin-api/refund/${teamId}/${chargeId}/${chargeAmount}`);
    toast.success('Refund successful! Please refresh the page to see updated charges');
  } catch (err) {
    console.error('error when refunding user: ', err);
    toast.error('Refund failed.')
  }

};

// Cancel a user's subscription
export const cancelSubscription = (teamId, subscriptionId) => async dispatch => {

  if (!teamId || !subscriptionId) {
    return;
  }

  try {
    await axios.post(`/admin-api/cancel/${teamId}/${subscriptionId}`);
    toast.success('Subscription cancelled! Refresh to see updated results');
  } catch (err) {
    console.error('error from cancelling subscription', err);
    toast.error('Cancel Subscription Failed');
  }

};
