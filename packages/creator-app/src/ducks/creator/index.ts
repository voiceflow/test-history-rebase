import { combineReducers } from 'redux';

import diagram, * as Diagram from './diagram';
import diagramsHistory, * as DiagramsHistory from './diagramsHistory';
import focus, * as Focus from './focus';

export * from './actions';
export * from './constants';
export * from './diagram';
export * from './diagramsHistory';
export * from './focus';
export * from './selectors';

const creatorReducer = combineReducers({
  [Focus.FOCUS_STATE_KEY]: focus,
  [Diagram.DIAGRAM_STATE_KEY]: diagram,
  [DiagramsHistory.DIAGRAMS_HISTORY_STATE_KEY]: diagramsHistory,
});

export default creatorReducer;
