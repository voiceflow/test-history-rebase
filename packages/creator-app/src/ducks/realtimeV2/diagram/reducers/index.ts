import { createRootReducer } from '../../utils/reducer';
import { INITIAL_DIAGRAM_STATE } from '../constants';
import { RealtimeDiagramState } from '../types';
import { hideCursorReducer, loadViewersReducer, moveCursorReducer, updateDiagramViewers } from './awareness';

export * from './awareness';

const realtimeDiagramReducer = createRootReducer<RealtimeDiagramState>(INITIAL_DIAGRAM_STATE)
  .immerCase(...moveCursorReducer)
  .immerCase(...hideCursorReducer)
  .immerCase(...loadViewersReducer)
  .immerCase(...updateDiagramViewers)
  .build();

export default realtimeDiagramReducer;
