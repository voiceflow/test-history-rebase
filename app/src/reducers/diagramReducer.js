import {
  FETCH_DIAGRAM_BEGIN,
  FETCH_DIAGRAMS_SUCCESS,
  FETCH_DIAGRAM_SUCCESS,
  FETCH_DIAGRAM_FAILURE,
  ON_FLOW_RENAME,
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
    default:
      return state;
  }
}