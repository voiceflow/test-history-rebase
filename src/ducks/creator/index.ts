import { combineReducers } from 'redux';

import diagram, * as Diagram from './diagram';
import focus, * as Focus from './focus';

export * from './focus';
export * from './diagram';
export * from './constants';
export * from './actions';
export * from './selectors';

const creatorReducer = combineReducers({
  [Focus.FOCUS_STATE_KEY]: focus,
  [Diagram.DIAGRAM_STATE_KEY]: diagram,
});

export default creatorReducer;
