import { createRootReducer } from '../../utils';
import { INITIAL_DIAGRAM_STATE } from '../constants';
import { RealtimeDiagramState } from '../types';
import { hideCursorReducer, moveCursorReducer } from './awareness';

export * from './awareness';

const realtimeProjectReducer = createRootReducer<RealtimeDiagramState>(INITIAL_DIAGRAM_STATE)
  .immerCase(...moveCursorReducer)
  .immerCases(...hideCursorReducer)
  .build();

export default realtimeProjectReducer;
