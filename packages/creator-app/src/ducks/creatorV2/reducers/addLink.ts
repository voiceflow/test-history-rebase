import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createActiveDiagramReducer } from './utils';

const addLinkReducer = createActiveDiagramReducer(Realtime.link.add, (state, { sourceNodeID, sourcePortID, targetNodeID, targetPortID, linkID }) => {
  if (Normal.hasOne(state.links, linkID)) return;
  if (!Normal.hasMany(state.nodes, [sourceNodeID, targetNodeID])) return;
  if (!Normal.hasMany(state.ports, [sourcePortID, targetPortID])) return;

  [sourceNodeID, targetNodeID].forEach((nodeID) => {
    const linkIDs = state.linkIDsByNodeID[nodeID] ?? [];

    state.linkIDsByNodeID[nodeID] = Utils.array.append(linkIDs, linkID);
  });

  [sourcePortID, targetPortID].forEach((portID) => {
    const linkIDs = state.linkIDsByPortID[portID] ?? [];

    state.linkIDsByPortID[portID] = Utils.array.append(linkIDs, linkID);
  });

  state.nodeIDsByLinkID[linkID] = [sourceNodeID, targetNodeID];
  state.portIDsByLinkID[linkID] = [sourcePortID, targetPortID];

  state.links = Normal.appendOne(state.links, linkID, {
    id: linkID,
    source: {
      nodeID: sourceNodeID,
      portID: sourcePortID,
    },
    target: {
      nodeID: targetNodeID,
      portID: targetPortID,
    },
  });
});

export default addLinkReducer;
