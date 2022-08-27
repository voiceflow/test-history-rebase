import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer } from './utils';

const transplantStepsReducer = createReducer(Realtime.node.transplantSteps, (state, { diagramID, sourceParentNodeID, removeSource }) => {
  if (!removeSource) return;

  const diagramSharedNodes = state.sharedNodes[diagramID];

  if (!diagramSharedNodes) return;

  delete diagramSharedNodes[sourceParentNodeID];
});

export default transplantStepsReducer;
