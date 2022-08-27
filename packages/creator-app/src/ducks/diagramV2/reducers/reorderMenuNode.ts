import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reorderMenuNodeReducer = createReducer(Realtime.diagram.reorderMenuNode, (state, { diagramID, nodeID, toIndex }) => {
  const diagram = Normal.getOne(state, diagramID);

  if (!diagram) return;

  diagram.menuNodeIDs = Utils.array.withoutValue(diagram.menuNodeIDs, nodeID);
  diagram.menuNodeIDs = Utils.array.insert(diagram.menuNodeIDs, toIndex, nodeID);
});

export default reorderMenuNodeReducer;
