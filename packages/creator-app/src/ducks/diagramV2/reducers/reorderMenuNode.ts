import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const reorderMenuNodeReducer = createReducer(Realtime.diagram.reorderMenuNode, (state, { diagramID, nodeID, toIndex }) => {
  const diagram = Normal.getOne(state, diagramID);

  if (!diagram) return;

  const fromIndex = diagram.menuNodeIDs.indexOf(nodeID);

  diagram.menuNodeIDs = Utils.array.reorder(diagram.menuNodeIDs, fromIndex, toIndex);
});

export default reorderMenuNodeReducer;
