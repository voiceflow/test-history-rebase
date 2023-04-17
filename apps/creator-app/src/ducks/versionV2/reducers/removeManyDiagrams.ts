import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer, removeVersionComponent } from './utils';

const removeDiagramReducer = createReducer(Realtime.diagram.crud.removeMany, (state, { versionID, keys }) =>
  keys.forEach(removeVersionComponent(state, versionID))
);

export default removeDiagramReducer;
