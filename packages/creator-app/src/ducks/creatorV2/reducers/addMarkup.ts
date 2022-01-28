import * as Realtime from '@realtime-sdk';
import { Utils } from '@voiceflow/common';
import * as Normal from 'normal-store';

import { nodeDataFactory } from '@/ducks/creator/diagram/factories';

import { addNode } from '../utils';
import { createActiveDiagramReducer } from './utils';

const addMarkupReducer = createActiveDiagramReducer(Realtime.node.addMarkup, (state, { nodeID, data, origin }) => {
  if (Normal.hasOne(state.nodes, nodeID)) return;

  state.markupIDs = Utils.array.append(state.markupIDs, nodeID);
  state.originByNodeID[nodeID] = origin;

  addNode(state, { nodeID, data: nodeDataFactory(nodeID, data) });
});

export default addMarkupReducer;
