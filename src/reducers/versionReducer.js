import {
  FETCH_VERSION_BEGIN,
  FETCH_VERSION_SUCCESS,
  FETCH_VERSION_FAILURE,
  FETCH_LIVE_VERSION_SUCCESS,
  FETCH_DEV_VERSION_SUCCESS,
  RESET_VERSION,
  SET_LIVE_MODE_MODAL,
  TOGGLE_LIVE,
  UPDATE_VERSION,
  UPDATE_FULFILLMENT,
  REMOVE_FULFILLMENT,
  UPDATE_VERSION_MERGE,
  UPDATE_ENTIRE_VERSION
} from '../actions/versionActions';

import update from 'immutability-helper';

const initialState = {
  skill: {},
  loading: false,
  error: null
};

export default function skillReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_VERSION_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_VERSION_SUCCESS:
      return {
        ...state,
        loading: false,
        skill: action.payload.skills
      };
    case RESET_VERSION:
      return {
        ...state,
        loading: false,
        error: null,
        skill: {}
      }
    case FETCH_LIVE_VERSION_SUCCESS:
      return {
        ...state,
        loading: false,
        live_version: action.payload.live,
        live_mode: action.payload.show,
        show_live_mode_modal: action.payload.show
      }
    case FETCH_DEV_VERSION_SUCCESS:
      return {
        ...state,
        loading: false,
        dev_skill: action.payload.dev_skill
      }
    case FETCH_VERSION_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        skill: {},
      };
    case TOGGLE_LIVE: 
      return {
        ...state,
        skill: action.payload.skill,
        diagram_id: action.payload.skill_id,
        live_version: action.payload.live_version,
        live_mode: action.payload.live_mode
      }
    case UPDATE_VERSION:
      return {
        ...state,
        skill: update(state.skill, { [action.payload.type]: {$set: action.payload.val }})
      }
    case UPDATE_FULFILLMENT:
      return {
        ...state,
        skill: update(state.skill, { fulfillment: {[action.payload.intent_key]: {$set: {[action.payload.slot_config]: action.payload.slot_config}}}})
      }

    case REMOVE_FULFILLMENT:
      return {
        ...state,
        skill: update(state.skill, { fulfillment: {$unset: [action.payload.intent_key]}})
      }
    case UPDATE_ENTIRE_VERSION:
      return {
        ...state,
        skill: update(state.skill, {$merge: action.payload.skill })
      }
    case UPDATE_VERSION_MERGE:
      return {
        ...state,
        skill: update(state.skill, { [action.payload.type]: {$merge: action.payload.val }})
      }
    case SET_LIVE_MODE_MODAL:
      return {
        ...state,
        show_live_mode_modal: action.payload.isLive
      }
    default:
      return state;
  }
}