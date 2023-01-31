import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { CreatorState } from '../types';

export const addLink = (
  state: Draft<CreatorState>,
  { sourceNodeID, sourcePortID, targetNodeID, targetPortID, linkID, data }: Realtime.link.AddDynamicPayload
): void => {
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
    data,
    source: {
      nodeID: sourceNodeID,
      portID: sourcePortID,
    },
    target: {
      nodeID: targetNodeID,
      portID: targetPortID,
    },
  });
};

export const removeLink = (state: Draft<CreatorState>, linkID: string): void => {
  const nodeIDs = state.nodeIDsByLinkID[linkID] ?? [];
  const portIDs = state.portIDsByLinkID[linkID] ?? [];

  nodeIDs.forEach((nodeID) => {
    const linkIDs = state.linkIDsByNodeID[nodeID] ?? [];

    state.linkIDsByNodeID[nodeID] = Utils.array.withoutValue(linkIDs, linkID);
  });

  portIDs.forEach((portID) => {
    const linkIDs = state.linkIDsByPortID[portID] ?? [];

    state.linkIDsByPortID[portID] = Utils.array.withoutValue(linkIDs, linkID);
  });

  delete state.nodeIDsByLinkID[linkID];
  delete state.portIDsByLinkID[linkID];

  state.links = Normal.removeOne(state.links, linkID);
};

export const removeNodePortRemapLinks = (state: Draft<CreatorState>, nodePortRemaps?: Realtime.NodePortRemap[]): void => {
  nodePortRemaps?.forEach(({ ports }) =>
    ports.forEach(({ portID }) => {
      if (!portID) return;

      const linkIDs = state.linkIDsByPortID[portID] ?? [];
      linkIDs.map((link) => removeLink(state, link));
    })
  );
};
