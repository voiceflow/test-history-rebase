import { Utils } from '@voiceflow/common';
import { Draft } from 'immer';
import * as Normal from 'normal-store';

import { CreatorState } from '../types';

// eslint-disable-next-line import/prefer-default-export
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
