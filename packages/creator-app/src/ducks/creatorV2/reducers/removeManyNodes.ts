import * as Realtime from '@realtime-sdk';
import { Utils } from '@voiceflow/common';
import * as Normal from 'normal-store';

import { flattenAllPorts, removeStepReferences } from '../utils';
import { removePort } from './removePort';
import { createActiveDiagramReducer } from './utils';

const removeManyNodesReducer = createActiveDiagramReducer(Realtime.node.removeMany, (state, { nodeIDs }) => {
  const nodesToRemove = new Set<string>(nodeIDs);
  const portsToRemove: string[] = [];

  const registerPorts = (nodeID: string) => {
    const portIDs = flattenAllPorts(state.portsByNodeID[nodeID]);

    portsToRemove.push(...portIDs);
  };

  nodeIDs.forEach((nodeID) => {
    const stepIDs = state.stepIDsByBlockID[nodeID] ?? [];

    stepIDs.forEach((stepID) => {
      nodesToRemove.add(stepID);
      registerPorts(stepID);
    });

    registerPorts(nodeID);
  });

  const removeNodeReferences = (nodeID: string) => {
    const blockID = state.blockIDByStepID[nodeID] ?? null;

    if (blockID && !nodesToRemove.has(blockID)) {
      removeStepReferences(state, { blockID, stepID: nodeID });
    }

    delete state.originByNodeID[nodeID];
    delete state.stepIDsByBlockID[nodeID];
    delete state.blockIDByStepID[nodeID];
    delete state.portsByNodeID[nodeID];
    delete state.linkIDsByNodeID[nodeID];
  };

  portsToRemove.forEach((portID) => {
    // removePort will also cleanup any relevant links
    removePort(state, portID);
  });
  nodesToRemove.forEach(removeNodeReferences);

  const nodesToRemoveArr = Array.from(nodesToRemove);

  state.markupIDs = Utils.array.withoutValues(state.markupIDs, nodesToRemoveArr);
  state.blockIDs = Utils.array.withoutValues(state.blockIDs, nodesToRemoveArr);
  state.nodes = Normal.removeMany(state.nodes, nodesToRemoveArr);
});

export default removeManyNodesReducer;
