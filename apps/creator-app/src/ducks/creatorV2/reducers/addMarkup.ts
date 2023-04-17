import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { nodeDataFactory } from '@/ducks/creator/diagram/factories';
import { createReverter } from '@/ducks/utils';

import { addNode } from '../utils';
import { createActiveDiagramReducer, DIAGRAM_INVALIDATORS } from './utils';

const addMarkupReducer = createActiveDiagramReducer(Realtime.node.addMarkup, (state, { nodeID, data, coords }) => {
  if (Normal.hasOne(state.nodes, nodeID)) return;

  state.markupIDs = Utils.array.append(state.markupIDs, nodeID);
  state.coordsByNodeID[nodeID] = coords;

  addNode(state, { nodeID, data: nodeDataFactory(nodeID, data) });
});

export default addMarkupReducer;

export const addMarkupReverter = createReverter(
  Realtime.node.addMarkup,

  ({ workspaceID, projectID, versionID, domainID, diagramID, nodeID }) =>
    Realtime.node.removeMany({ workspaceID, projectID, versionID, domainID, diagramID, nodes: [{ parentNodeID: nodeID }] }),

  DIAGRAM_INVALIDATORS
);
