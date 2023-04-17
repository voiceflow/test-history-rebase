import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter, emptyOutPortsAdapter, emptyOutPortsAdapterV2 } from '../utils';

const goToNodeAdapter = createBlockAdapter<BaseNode.GoToNode.StepData, NodeData.GoToNode>(
  ({ nodeID, diagramID }) => ({ diagramID, goToNodeID: nodeID }),
  ({ goToNodeID = null, diagramID = null }) => ({ nodeID: goToNodeID, diagramID })
);

export const goToNodeOutPortsAdapter = emptyOutPortsAdapter;

export const goToNodeOutPortsAdapterV2 = emptyOutPortsAdapterV2;

export default goToNodeAdapter;
