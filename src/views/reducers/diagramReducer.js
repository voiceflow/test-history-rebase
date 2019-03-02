import {
  FETCH_DIAGRAM_BEGIN,
  FETCH_DIAGRAMS_SUCCESS,
  FETCH_DIAGRAM_SUCCESS,
  FETCH_DIAGRAM_FAILURE,
  ON_FLOW_RENAME,
  SET_LIVE_MODE_MODAL,
} from '../actions/diagramActions';

const initialState = {
  diagrams: [],
  loading: false,
  error: null
};

export default function diagramReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_DIAGRAM_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_DIAGRAMS_SUCCESS:
      return {
        ...state,
        diagrams: action.payload.diagrams,
        loading: false,
      };
    case FETCH_DIAGRAM_SUCCESS:
      return {
        ...state,
        loading: false,
      }
    case FETCH_DIAGRAM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        diagrams: [],
      };
    case ON_FLOW_RENAME:
      return {
        ...state
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