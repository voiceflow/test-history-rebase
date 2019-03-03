import {
  FETCH_SKILLS_BEGIN,
  FETCH_SKILLS_SUCCESS,
  FETCH_SKILLS_FAILURE,
  FETCH_LIVE_SKILLS_SUCCESS,
  FETCH_DEV_SKILLS_SUCCESS,
  SET_LIVE_MODE_MODAL,
  TOGGLE_LIVE,
  UPDATE_SKILL,
  UPDATE_SKILL_MERGE
} from '../actions/skillActions';

import update from 'immutability-helper';

const initialState = {
  skill: {},
  loading: false,
  error: null
};

export default function skillReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_SKILLS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_SKILLS_SUCCESS:
      return {
        ...state,
        loading: false,
        skill: action.payload.skills
      };

    case FETCH_LIVE_SKILLS_SUCCESS:
      return {
        ...state,
        loading: false,
        live_version: action.payload.live,
        live_mode: action.payload.show,
        show_live_mode_modal: action.payload.show
      }
    case FETCH_DEV_SKILLS_SUCCESS:
      return {
        ...state,
        loading: false,
        dev_skill: action.payload.dev_skill
      }
    case FETCH_SKILLS_FAILURE:
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
        live_mode: action.payload.live_mode,
      }
    case UPDATE_SKILL:
      return {
        ...state,
        skill: update(state.skill, { [action.payload.type]: {$set: action.payload.val }})
      }
    case UPDATE_SKILL_MERGE:
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