import axios from 'axios';
import _ from "lodash";
import {toast} from 'react-toastify';

export const SET_CREATOR = 'SET_CREATOR';
export const FIND_CREATOR_FAILED = 'FIND_CREATOR_FAILED';

const initialState = {
  // The current creator being searched
  creator: {},
  boards: [],
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

// Refund a specific user
export const refundCreator = creatorId => async dispatch => {

  if (!creatorId) {
    return;
  }

  try {
    let response = await axios.post(`/admin-api/refund/${this.props.creator.creator_id}`);
    toast.success('Refund successful!');
    console.log('response from refund: ', response);
  } catch (err) {
    console.error('error when refunding user: ', err);
    toast.error('Refund failed.')
  }

};

// Cancel a user's subscription
export const cancelSubscription = creatorId => async dispatch => {

  if (!creatorId) {
    return;
  }

  try {
    let response = await axios.post(`/admin-api/cancel/${this.props.creator.creator_id}`);
    toast.success('Subscription cancelled!');
    console.log('response from cancel: ', response);
  } catch (err) {
    console.error('error from cancelling subscription', err);
    toast.error('Cancel Subscription Failed');
  }

};
