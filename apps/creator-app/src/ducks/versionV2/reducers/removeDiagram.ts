import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer, removeVersionComponent } from './utils';

const removeDiagramReducer = createReducer(Realtime.diagram.crud.remove, (state, { versionID, key }) =>
  removeVersionComponent(state, versionID)(key)
);

export default removeDiagramReducer;
