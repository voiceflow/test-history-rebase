import {
  FETCH_DIAGRAM_VARIABLES_BEGIN,
  FETCH_DIAGRAM_VARIABLES_SUCCESS,
  FETCH_DIAGRAM_VARIABLES_FAILURE
} from '../actions/diagramVariablesAction';

const initialState = {
  diagramVariables: [],
  loading: false,
  error: null
};

export default function diagramVariablesReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_DIAGRAM_VARIABLES_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_DIAGRAM_VARIABLES_SUCCESS:
      return {
        ...state,
        loading: false,
        diagramVariables: action.payload.diagramVariables
      };

    case FETCH_DIAGRAM_VARIABLES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        diagramVariables: [],
      };
    default:
      return state;
  }
}