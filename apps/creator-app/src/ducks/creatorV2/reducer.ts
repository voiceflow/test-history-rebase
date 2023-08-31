import compositeReducer from 'composite-reducer';

import diagramsHistoryReducer, * as DiagramsHistory from './diagramsHistory';
import focusReducer, * as Focus from './focus';
import creatorBaseReducer from './reducers';

export default compositeReducer(creatorBaseReducer, {
  [Focus.FOCUS_STATE_KEY]: focusReducer,
  [DiagramsHistory.DIAGRAMS_HISTORY_STATE_KEY]: diagramsHistoryReducer,
});
