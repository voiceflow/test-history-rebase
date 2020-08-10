import { createSelector } from 'reselect';

import { createKeyedSelector } from '@/ducks/utils';
import { NodeData } from '@/models';
import { denormalize, getAllNormalizedByKeys, getNormalizedByKey } from '@/utils/normalized';

import { creatorStateSelector } from '../selectors';
import { DIAGRAM_STATE_KEY } from './constants';
import { getLinkIDsByNodeID, getLinkIDsByPortID, getLinkedNodeIDsByNodeID } from './utils';

const rootHistorySelector = createKeyedSelector(creatorStateSelector, DIAGRAM_STATE_KEY);

const rootSelector = createSelector([rootHistorySelector], ({ present }) => present);

export { rootSelector as creatorDiagramSelector };

export const creatorDiagramIDSelector = createSelector([rootSelector], ({ diagramID }) => diagramID);

export const rootNodeIDsSelector = createSelector([rootSelector], ({ rootNodeIDs }) => rootNodeIDs);

export const isRootNodeSelector = createSelector([rootNodeIDsSelector], (rootNodeIDs) => (nodeID: string) => rootNodeIDs.includes(nodeID));

export const allNodeIDsSelector = createSelector([rootSelector], ({ nodes }) => nodes.allKeys);

export const stepNodeIDsSelector = createSelector([rootSelector, allNodeIDsSelector], ({ nodes }, nodeIDs) =>
  nodeIDs.filter((nodeID) => !!getNormalizedByKey(nodes, nodeID).parentNode)
);

export const nodeByIDSelector = createSelector([rootSelector], ({ nodes }) => (nodeID: string) => getNormalizedByKey(nodes, nodeID));

export const allNodesByIDsSelector = createSelector([rootSelector], ({ nodes }) => (nodeIDs: string[]) => getAllNormalizedByKeys(nodes, nodeIDs));

export const allLinkIDsSelector = createSelector([rootSelector], ({ links }) => links.allKeys);

export const allLinksSelector = createSelector([rootSelector], ({ links }) => denormalize(links));

export const linkByIDSelector = createSelector([rootSelector], ({ links }) => (linkID: string) => getNormalizedByKey(links, linkID));

export const allLinksByIDsSelector = createSelector([rootSelector], ({ links }) => (linkIDs: string[]) => getAllNormalizedByKeys(links, linkIDs));

export const dataByNodeIDSelector = createSelector([rootSelector], ({ data }) => <T>(nodeID: string) => data[nodeID] as NodeData<T>);

export const allNodeDataSelector = createSelector([rootSelector], ({ nodes, data }) => nodes.allKeys.map((nodeID) => data[nodeID]));

export const portByIDSelector = createSelector([rootSelector], ({ ports }) => (portID: string) => getNormalizedByKey(ports, portID));

export const allPortsByIDsSelector = createSelector([rootSelector], ({ ports }) => (portIDs: string[]) => getAllNormalizedByKeys(ports, portIDs));

export const linkIDsByNodeIDSelector = createSelector([rootSelector], getLinkIDsByNodeID);

export const linkedNodeIDsByNodeIDSelector = createSelector([rootSelector], getLinkedNodeIDsByNodeID);

export const linksByNodeIDSelector = createSelector([allLinksByIDsSelector, linkIDsByNodeIDSelector], (getLinks, getLinkIDs) => (nodeID: string) =>
  getLinks(getLinkIDs(nodeID))
);

export const hasLinksByNodeIDSelector = createSelector([linksByNodeIDSelector], (getLinks) => (nodeID: string) => !!getLinks(nodeID).length);

export const linkIDsByPortIDSelector = createSelector([rootSelector], getLinkIDsByPortID);

export const linksByPortIDSelector = createSelector([allLinksByIDsSelector, linkIDsByPortIDSelector], (getLinks, getLinkIDs) => (portID: string) =>
  getLinks(getLinkIDs(portID))
);

export const hasLinksByPortIDSelector = createSelector([linksByPortIDSelector], (getLinks) => (portID: string) => !!getLinks(portID).length);

export const sectionStateSelector = createSelector([rootSelector], ({ sections }) => (key: string) => sections[key]);

export const markupNodeIDsSelector = createSelector([rootSelector], ({ markupNodeIDs }) => markupNodeIDs);

export const diagramStateSelector = createSelector([rootSelector], ({ diagramState }) => diagramState);
