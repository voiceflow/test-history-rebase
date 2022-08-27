/* eslint-disable no-param-reassign */
import * as Realtime from '@voiceflow/realtime-sdk';

import { addSharedNodeAndMenuNode, createReducer, nodeDataToSharedNode } from './utils';

const importSnapshotReducer = createReducer(Realtime.creator.importSnapshot, (state, { diagramID, nodesWithData }) => {
  if (!nodesWithData.length) return;

  state.sharedNodes[diagramID] ??= {};

  nodesWithData.forEach(({ data }) => addSharedNodeAndMenuNode(state, diagramID, nodeDataToSharedNode(data)));
});

export default importSnapshotReducer;
