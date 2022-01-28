import * as Realtime from '@realtime-sdk';
import { Utils } from '@voiceflow/common';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { CreatorState } from '../types';
import { removeLink } from './removeLink';
import { createActiveDiagramReducer } from './utils';

const deleteByValue = <T>(obj: Draft<Record<string, T>>, value: T) =>
  Object.keys(obj).forEach((key) => {
    if (obj[key] === value) {
      delete obj[key];
    }
  });

export const removePortFromNode = (state: Draft<CreatorState>, nodeID: string, portID: string): void => {
  const ports = state.portsByNodeID[nodeID];
  const linkIDs = state.linkIDsByPortID[portID] ?? [];

  linkIDs.forEach((linkID) => {
    removeLink(state, linkID);
  });

  if (ports) {
    ports.out.dynamic = Utils.array.withoutValue(ports.out.dynamic, portID);
    deleteByValue(ports.out.builtIn, portID);
  }

  delete state.nodeIDByPortID[portID];
  delete state.linkIDsByPortID[portID];

  state.ports = Normal.removeOne(state.ports, portID);
};

export const removePort = (state: Draft<CreatorState>, portID: string): void => {
  const nodeID = state.nodeIDByPortID[portID] ?? null;

  if (nodeID) {
    removePortFromNode(state, nodeID, portID);
  }
};

const removePortReducer = createActiveDiagramReducer(Realtime.node.removePort, (state, { nodeID, portID }) => {
  removePortFromNode(state, nodeID, portID);
});

export default removePortReducer;
