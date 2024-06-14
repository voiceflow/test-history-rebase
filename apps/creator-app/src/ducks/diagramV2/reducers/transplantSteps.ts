import * as Realtime from '@voiceflow/realtime-sdk';

import { createReducer, removeSharedNodes } from './utils';

/**
 * @deprecated remove with REFERENCE_SYSTEM ff removal
 */
const transplantStepsReducer = createReducer(
  Realtime.node.transplantSteps,
  (state, { diagramID, sourceParentNodeID, removeSource, removeNodes }) => {
    const removeNodeIDs = removeNodes.map((node) => node.stepID ?? node.parentNodeID);

    removeSharedNodes(state, diagramID, [...removeNodeIDs, ...(removeSource ? [sourceParentNodeID] : [])]);
  }
);

export default transplantStepsReducer;
