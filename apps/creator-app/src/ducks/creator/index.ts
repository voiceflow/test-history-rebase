import { combineReducers } from 'redux';

import diagramsHistory, * as DiagramsHistory from './diagramsHistory';
import focus, * as Focus from './focus';

export * from './constants';
export * from './diagram';
export * from './diagramsHistory';
export * from './focus';
export * from './selectors';

const creatorReducer = combineReducers({
  [Focus.FOCUS_STATE_KEY]: focus,
  [DiagramsHistory.DIAGRAMS_HISTORY_STATE_KEY]: diagramsHistory,
});

export default creatorReducer;
