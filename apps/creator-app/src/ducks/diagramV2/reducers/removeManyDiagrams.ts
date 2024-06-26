import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer, removeDiagramSharedNodes } from './utils';

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
const removeManyDiagramsReducer = createReducer(Realtime.diagram.crud.removeMany, (state, { keys }) =>
  keys.forEach((key) => removeDiagramSharedNodes(state, key))
);

export default removeManyDiagramsReducer;
