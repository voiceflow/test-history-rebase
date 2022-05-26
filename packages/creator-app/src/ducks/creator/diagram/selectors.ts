import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';
import { createSelector } from 'reselect';

import { BlockType } from '@/constants';
import { createKeyedSelector } from '@/ducks/utils';

import { creatorStateSelector } from '../selectors';
import { DIAGRAM_STATE_KEY } from './constants';
import { getJoiningLinkIDs, getLinkedNodeIDsByNodeID, getLinkIDsByNodeID, getLinkIDsByPortID } from './utils';

const rootHistorySelector = createKeyedSelector(creatorStateSelector, DIAGRAM_STATE_KEY);

/**
 * @deprecated
 */
const rootSelector = createSelector([rootHistorySelector], ({ present }) => present);

const normalizedDataSelector = createSelector([rootSelector], ({ data }) => data);

const normalizePortsSelector = createSelector([rootSelector], ({ ports }) => ports);

const normalizedLinksSelector = createSelector([rootSelector], ({ links }) => links);

const normalizedNodesSelector = createSelector([rootSelector], ({ nodes }) => nodes);

export { rootSelector as creatorDiagramSelector };

/**
 * @deprecated
 */
export const creatorDiagramIDSelector = createSelector([rootSelector], ({ diagramID }) => diagramID);

/**
 * @deprecated
 */
export const rootNodeIDsSelector = createSelector([rootSelector], ({ rootNodeIDs }) => rootNodeIDs);

/**
 * @deprecated
 */
export const allNodeIDsSelector = createSelector([normalizedNodesSelector], (nodes) => nodes.allKeys);

/**
 * @deprecated
 */
export const stepNodeIDsSelector = createSelector([normalizedNodesSelector], (nodes) =>
  nodes.allKeys.filter((nodeID) => !!Normal.getOne(nodes, nodeID)?.parentNode)
);

/**
 * @deprecated
 */
export const startNodeIDSelector = createSelector([normalizedNodesSelector], (nodes) => {
  const allNodes = Object.values(nodes.byKey);

  return allNodes.find((node) => node.type === BlockType.START)?.id;
});

/**
 * @deprecated
 */
export const nodeByIDSelector = createSelector(
  [normalizedNodesSelector],
  (nodes) => (nodeID: string) => Utils.normalized.safeGetNormalizedByKey(nodes, nodeID)
);

/**
 * @deprecated
 */
export const allNodesByIDsSelector = createSelector([normalizedNodesSelector], (nodes) => (nodeIDs: string[]) => Normal.getMany(nodes, nodeIDs));

/**
 * @deprecated
 */
export const combinedNodeIDsSelector = createSelector([nodeByIDSelector], (getNode) => (nodeID: string) => getNode(nodeID)?.combinedNodes ?? []);

/**
 * @deprecated
 */
export const allLinkIDsSelector = createSelector([normalizedLinksSelector], (links) => links.allKeys);

/**
 * @deprecated
 */
export const allLinksSelector = createSelector([normalizedLinksSelector], Normal.denormalize);

/**
 * @deprecated
 */
export const linkByIDSelector = createSelector(
  [normalizedLinksSelector],
  (links) => (linkID: string) => Utils.normalized.safeGetNormalizedByKey(links, linkID)
);

const allLinksByIDsSelector = createSelector([normalizedLinksSelector], (links) => (linkIDs: string[]) => Normal.getMany(links, linkIDs));

/**
 * @deprecated
 */
export const allNodeDataSelector = createSelector([normalizedDataSelector], (data) => Object.values(data));

/**
 * @deprecated
 */
export const dataByNodeIDSelector = createSelector(
  [normalizedDataSelector],
  (data) =>
    <T>(nodeID: string) =>
      data[nodeID] as Realtime.NodeData<T> | Realtime.BlockNodeData<T>
);

/**
 * @deprecated
 */
export const dataByNodeIDsSelector = createSelector(
  [dataByNodeIDSelector],
  (getDataByNodeID) =>
    (nodeIDs: string[]): Realtime.NodeData<unknown>[] =>
      nodeIDs.map(getDataByNodeID).filter(Boolean)
);

/**
 * @deprecated
 */
export const portByIDSelector = createSelector(
  [normalizePortsSelector],
  (ports) => (portID: string) => Utils.normalized.safeGetNormalizedByKey(ports, portID)
);

/**
 * @deprecated
 */
export const allPortsByIDsSelector = createSelector([normalizePortsSelector], (ports) => (portIDs: string[]) => Normal.getMany(ports, portIDs));

/**
 * @deprecated
 */
export const linkIDsByNodeIDSelector = createSelector([rootSelector], getLinkIDsByNodeID);

/**
 * @deprecated
 */
export const joiningLinkIDsSelector = createSelector([rootSelector], getJoiningLinkIDs);

/**
 * @deprecated
 */
export const linkedNodeIDsByNodeIDSelector = createSelector([rootSelector], getLinkedNodeIDsByNodeID);

/**
 * @deprecated
 */
export const linksByNodeIDSelector = createSelector(
  [allLinksByIDsSelector, linkIDsByNodeIDSelector],
  (getLinks, getLinkIDs) => (nodeID: string) => getLinks(getLinkIDs(nodeID))
);

/**
 * @deprecated
 */
export const linkIDsByPortIDSelector = createSelector([rootSelector], getLinkIDsByPortID);

/**
 * @deprecated
 */
export const linksByPortIDSelector = createSelector(
  [allLinksByIDsSelector, linkIDsByPortIDSelector],
  (getLinks, getLinkIDs) => (portID: string) => getLinks(getLinkIDs(portID))
);

export const sectionStateSelector = createSelector(
  [rootSelector],
  ({ sections }) =>
    (key: string) =>
      sections[key]
);

/**
 * @deprecated
 */
export const markupNodeIDsSelector = createSelector([rootSelector], ({ markupNodeIDs }) => markupNodeIDs);

export const diagramStateSelector = createSelector([rootSelector], ({ diagramState }) => diagramState);

export const isHiddenSelector = createSelector([rootSelector], ({ hidden }) => hidden);
