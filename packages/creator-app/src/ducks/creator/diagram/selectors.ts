import { createSelector } from 'reselect';

import { BlockType } from '@/constants';
import { createKeyedSelector } from '@/ducks/utils';
import * as VersionV2 from '@/ducks/versionV2';
import { NodeData } from '@/models';
import { denormalize, getAllNormalizedByKeys, getNormalizedByKey } from '@/utils/normalized';

import { creatorStateSelector } from '../selectors';
import { DIAGRAM_STATE_KEY } from './constants';
import { getJoiningLinkIDs, getLinkedNodeIDsByNodeID, getLinkIDsByNodeID, getLinkIDsByPortID } from './utils';

const rootHistorySelector = createKeyedSelector(creatorStateSelector, DIAGRAM_STATE_KEY);

const rootSelector = createSelector([rootHistorySelector], ({ present }) => present);

const normalizedDataSelector = createSelector([rootSelector], ({ data }) => data);

const normalizePortsSelector = createSelector([rootSelector], ({ ports }) => ports);

const normalizedLinksSelector = createSelector([rootSelector], ({ links }) => links);

const normalizedNodesSelector = createSelector([rootSelector], ({ nodes }) => nodes);

export { rootSelector as creatorDiagramSelector };

export const creatorDiagramIDSelector = createSelector([rootSelector], ({ diagramID }) => diagramID);

export const isRootDiagramActiveSelector = createSelector(
  [VersionV2.active.rootDiagramIDSelector, creatorDiagramIDSelector],
  (rootDiagramID, activeDiagramID) => !!rootDiagramID && !!activeDiagramID && rootDiagramID === activeDiagramID
);

export const rootNodeIDsSelector = createSelector([rootSelector], ({ rootNodeIDs }) => rootNodeIDs);

export const isRootNodeSelector = createSelector([rootNodeIDsSelector], (rootNodeIDs) => (nodeID: string) => rootNodeIDs.includes(nodeID));

export const allNodeIDsSelector = createSelector([normalizedNodesSelector], (nodes) => nodes.allKeys);

export const stepNodeIDsSelector = createSelector([normalizedNodesSelector], (nodes) =>
  nodes.allKeys.filter((nodeID) => !!getNormalizedByKey(nodes, nodeID).parentNode)
);

export const startNodeIDSelector = createSelector([normalizedNodesSelector], (nodes) => {
  const allNodes = Object.values(nodes.byKey);

  return allNodes.find((node) => node.type === BlockType.START)?.id;
});

export const nodeByIDSelector = createSelector([normalizedNodesSelector], (nodes) => (nodeID: string) => getNormalizedByKey(nodes, nodeID));

export const allNodesByIDsSelector = createSelector(
  [normalizedNodesSelector],
  (nodes) => (nodeIDs: string[]) => getAllNormalizedByKeys(nodes, nodeIDs)
);

export const combinedNodeIDsSelector = createSelector([nodeByIDSelector], (getNode) => (nodeID: string) => getNode(nodeID).combinedNodes);

export const allLinkIDsSelector = createSelector([normalizedLinksSelector], (links) => links.allKeys);

export const allLinksSelector = createSelector([normalizedLinksSelector], (links) => denormalize(links));

export const linkByIDSelector = createSelector([normalizedLinksSelector], (links) => (linkID: string) => getNormalizedByKey(links, linkID));

export const allLinksByIDsSelector = createSelector(
  [normalizedLinksSelector],
  (links) => (linkIDs: string[]) => getAllNormalizedByKeys(links, linkIDs)
);

export const dataByNodeIDSelector = createSelector(
  [normalizedDataSelector],
  (data) =>
    <T>(nodeID: string) =>
      data[nodeID] as NodeData<T>
);

export const allNodeDataSelector = createSelector([normalizedNodesSelector, normalizedDataSelector], (nodes, data) =>
  nodes.allKeys.map((nodeID) => data[nodeID])
);

export const portByIDSelector = createSelector([normalizePortsSelector], (ports) => (portID: string) => getNormalizedByKey(ports, portID));

export const allPortsByIDsSelector = createSelector(
  [normalizePortsSelector],
  (ports) => (portIDs: string[]) => getAllNormalizedByKeys(ports, portIDs)
);

export const linkIDsByNodeIDSelector = createSelector([rootSelector], getLinkIDsByNodeID);

export const joiningLinkIDsSelector = createSelector([rootSelector], getJoiningLinkIDs);

export const linkedNodeIDsByNodeIDSelector = createSelector([rootSelector], getLinkedNodeIDsByNodeID);

export const linksByNodeIDSelector = createSelector(
  [allLinksByIDsSelector, linkIDsByNodeIDSelector],
  (getLinks, getLinkIDs) => (nodeID: string) => getLinks(getLinkIDs(nodeID))
);

export const hasLinksByNodeIDSelector = createSelector([linksByNodeIDSelector], (getLinks) => (nodeID: string) => !!getLinks(nodeID).length);

export const linkIDsByPortIDSelector = createSelector([rootSelector], getLinkIDsByPortID);

export const linksByPortIDSelector = createSelector(
  [allLinksByIDsSelector, linkIDsByPortIDSelector],
  (getLinks, getLinkIDs) => (portID: string) => getLinks(getLinkIDs(portID))
);

export const hasLinksByPortIDSelector = createSelector([linksByPortIDSelector], (getLinks) => (portID: string) => !!getLinks(portID).length);

export const sectionStateSelector = createSelector(
  [rootSelector],
  ({ sections }) =>
    (key: string) =>
      sections[key]
);

export const markupNodeIDsSelector = createSelector([rootSelector], ({ markupNodeIDs }) => markupNodeIDs);

export const diagramStateSelector = createSelector([rootSelector], ({ diagramState }) => diagramState);

export const isHiddenSelector = createSelector([rootSelector], ({ hidden }) => hidden);

export const intentStepsDataSelector = createSelector([normalizedNodesSelector, normalizedDataSelector], (nodes, data) =>
  denormalize(nodes)
    .filter((node) => node.type === BlockType.INTENT)
    .map((node) => data[node.id])
);
