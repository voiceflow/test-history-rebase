import cuid from 'cuid';
import { createSelector } from 'reselect';

import { createAction, createRootSelector } from '@/ducks/utils';
import * as CRUD from '@/ducks/utils/crud';
import { updateViewportForDiagram } from '@/ducks/viewport';
import { reorder } from '@/utils/array';
import { compose } from '@/utils/functional';
import { denormalize, getAllNormalizedByKeys, getNormalizedByKey, normalize } from '@/utils/normalized';

import addLinkReducer from './addLink';
import addNodeReducer, { addManyNodesReducer, addNestedNodeReducer } from './addNode';
import { portFactory } from './factories';
import insertNestedNodeReducer from './insertNestedNode';
import mergeNodesReducer from './mergeNodes';
import removeNodeReducer, { removeManyNodesReducer } from './removeNode';
import unmergeNodeReducer from './unmergeNode';
import {
  addAllLinksToState,
  addPortToBlockInState,
  buildLinkedNodesByNodeID,
  buildLinksByNodeID,
  buildLinksByPortID,
  getLinkIDsByNodeID,
  getLinkIDsByPortID,
  getLinkedNodeIDsByNodeID,
  patchNodeInState,
  removeAllLinksFromState,
  removeLinkFromState,
  removePortFromBlockInState,
} from './utils';

export const STATE_KEY = 'creator';

const DEFAULT_STATE = {
  diagramID: null,
  focus: {
    target: null,
    isActive: false,
    renameActiveRevision: null,
  },
  rootNodes: [],
  nodes: CRUD.DEFAULT_STATE,
  links: CRUD.DEFAULT_STATE,
  ports: {},
  data: {},
  linksByPortID: {},
  linksByNodeID: {},
};

// actions

export const INITIALIZE_CREATOR = 'CREATOR:INITIALIZE';
export const RESET_CREATOR = 'CREATOR:RESET';
export const UPDATE_NODE_DATA = 'CREATOR:NODE:UPDATE_DATA';
export const UPDATE_NODE_LOCATION = 'CREATOR:NODE:UPDATE_LOCATION';
export const MERGE_NODES = 'CREATOR:NODE:MERGE';
export const UNMERGE_NODE = 'CREATOR:NODE:UNMERGE';
export const INSERT_NESTED_NODE = 'CREATOR:NODE:INSERT_NESTED';
export const ADD_NODE = 'CREATOR:NODE:ADD';
export const ADD_MANY_NODES = 'CREATOR:NODE:ADD_MANY';
export const ADD_NESTED_NODE = 'CREATOR:NODE:ADD_NESTED';
export const REORDER_NESTED_NODES = 'CREATOR:NODE:REORDER_NESTED';
export const REMOVE_NODE = 'CREATOR:NODE:REMOVE';
export const REMOVE_MANY_NODES = 'CREATOR:NODE:REMOVE_MANY';
export const ADD_PORT = 'CREATOR:PORT:ADD';
export const REMOVE_PORT = 'CREATOR:PORT:REMOVE';
export const ADD_LINK = 'CREATOR:LINK:ADD';
export const REMOVE_LINK = 'CREATOR:LINK:REMOVE';
export const REMOVE_HIDDEN_LINKS = 'CREATOR:LINK:REMOVE_HIDDEN';
export const SET_FOCUS = 'CREATOR:FOCUS:SET';
export const CLEAR_FOCUS = 'CREATOR:FOCUS:CLEAR';

// reducers

export const initializeCreatorReducer = (state, { payload: { diagramID, rootNodes, nodes, links, ports, data } }) => ({
  ...state,
  diagramID,
  rootNodes,
  data,
  ports: normalize(ports),
  nodes: normalize(nodes),
  links: normalize(links),
  linksByPortID: buildLinksByPortID(links),
  linksByNodeID: buildLinksByNodeID(links),
  linkedNodesByNodeID: buildLinkedNodesByNodeID(links),
});

export const reorderNestedNodesReducer = (state, { payload: { nodeID, sourceIndex, targetIndex } }) => {
  const node = getNormalizedByKey(state.nodes, nodeID);
  const reorderedNodes = reorder(node.combinedNodes, sourceIndex, targetIndex);
  const removeOutboundLinks = sourceIndex === node.combinedNodes.length - 1 || targetIndex === node.combinedNodes.length - 1;

  return compose(
    patchNodeInState(nodeID, {
      combinedNodes: reorderedNodes,
    }),
    ...(removeOutboundLinks
      ? [
          removeAllLinksFromState(
            getNormalizedByKey(state.nodes, node.combinedNodes[node.combinedNodes.length - 1]).ports.out.flatMap(getLinkIDsByPortID(state))
          ),
        ]
      : [])
  )(state);
};

export const updateNodeDataReducer = (state, { payload: { nodeID, data, patch } }) => ({
  ...state,
  data: {
    ...state.data,
    [nodeID]: patch ? { ...state.data[nodeID], ...data } : data,
  },
});

export const updateNodeLocationReducer = (state, { payload: { nodeID, x, y } }) => patchNodeInState(nodeID, { x, y })(state);

export const addPortReducer = (state, { payload: { nodeID, portID, port } }) => addPortToBlockInState(portFactory(nodeID, portID, port))(state);

export const addManyLinksReducer = (state, { payload: links }) => addAllLinksToState(links)(state);

export const removePortReducer = (state, { payload: portID }) =>
  compose(
    removePortFromBlockInState(portID),
    removeAllLinksFromState(getLinkIDsByPortID(state)(portID))
  )(state);

export const removeLinkReducer = (state, { payload: linkID }) => removeLinkFromState(linkID)(state);

export const removeHiddenLinksReducer = (state, { payload: platform }) => {
  const hiddenLinkIDs = state.links.allKeys.filter((linkID) => {
    const link = getNormalizedByKey(state.links, linkID);
    const port = getNormalizedByKey(state.ports, link.source.portID);

    return port.platform && port.platform !== platform;
  });

  return removeAllLinksFromState(hiddenLinkIDs)(state);
};

export const setFocusReducer = (state, { payload: { nodeID, renameActiveRevision } }) => {
  if (state.focus.isActive && nodeID === state.focus.target && renameActiveRevision === state.focus.renameActiveRevision) {
    return state;
  }

  return {
    ...state,
    focus: {
      target: nodeID,
      isActive: true,
      renameActiveRevision,
    },
  };
};

export const clearFocusReducer = (state) => {
  if (!state.focus.isActive) {
    return state;
  }

  return {
    ...state,
    focus: {
      ...state.focus,
      isActive: false,
      renameActiveRevision: null,
    },
  };
};

function creatorReducer(state = DEFAULT_STATE, action) {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case INITIALIZE_CREATOR:
      return initializeCreatorReducer(state, action);
    case RESET_CREATOR:
      return DEFAULT_STATE;
    case UPDATE_NODE_DATA:
      return updateNodeDataReducer(state, action);
    case UPDATE_NODE_LOCATION:
      return updateNodeLocationReducer(state, action);
    case MERGE_NODES:
      return mergeNodesReducer(state, action);
    case UNMERGE_NODE:
      return unmergeNodeReducer(state, action);
    case INSERT_NESTED_NODE:
      return insertNestedNodeReducer(state, action);
    case ADD_NODE:
      return addNodeReducer(state, action);
    case ADD_MANY_NODES:
      return addManyNodesReducer(state, action);
    case ADD_NESTED_NODE:
      return addNestedNodeReducer(state, action);
    case REORDER_NESTED_NODES:
      return reorderNestedNodesReducer(state, action);
    case REMOVE_NODE:
      return removeNodeReducer(state, action);
    case REMOVE_MANY_NODES:
      return removeManyNodesReducer(state, action);
    case ADD_PORT:
      return addPortReducer(state, action);
    case REMOVE_PORT:
      return removePortReducer(state, action);
    case ADD_LINK:
      return addLinkReducer(state, action);
    case REMOVE_LINK:
      return removeLinkReducer(state, action);
    case REMOVE_HIDDEN_LINKS:
      return removeHiddenLinksReducer(state, action);
    case SET_FOCUS:
      return setFocusReducer(state, action);
    case CLEAR_FOCUS:
      return clearFocusReducer(state);
    default:
      return state;
  }
}

export default creatorReducer;

// selectors

const rootSelector = createRootSelector(STATE_KEY);

export { rootSelector as creatorStateSelector };

export const creatorDiagramIDSelector = createSelector(
  rootSelector,
  ({ diagramID }) => diagramID
);

export const rootNodeIDsSelector = createSelector(
  rootSelector,
  ({ rootNodes }) => rootNodes
);

export const nodeByIDSelector = createSelector(
  rootSelector,
  ({ nodes }) => (id) => getNormalizedByKey(nodes, id)
);

export const allNodesByIDsSelector = createSelector(
  rootSelector,
  ({ nodes }) => (ids) => getAllNormalizedByKeys(nodes, ids)
);

export const allLinkIDsSelector = createSelector(
  rootSelector,
  ({ links }) => links.allKeys
);

export const allLinksSelector = createSelector(
  rootSelector,
  ({ links }) => denormalize(links)
);

export const linkByIDSelector = createSelector(
  rootSelector,
  ({ links }) => (id) => getNormalizedByKey(links, id)
);

export const allLinksByIDsSelector = createSelector(
  rootSelector,
  ({ links }) => (ids) => getAllNormalizedByKeys(links, ids)
);

export const dataByNodeIDSelector = createSelector(
  rootSelector,
  ({ data }) => (nodeID) => data[nodeID]
);

export const allNodeDataSelector = createSelector(
  rootSelector,
  ({ nodes, data }) => nodes.allKeys.map((nodeID) => data[nodeID])
);

export const portByIDSelector = createSelector(
  rootSelector,
  ({ ports }) => (id) => getNormalizedByKey(ports, id)
);

export const allPortsByIDsSelector = createSelector(
  rootSelector,
  ({ ports }) => (ids) => getAllNormalizedByKeys(ports, ids)
);

export const linkIDsByNodeIDSelector = createSelector(
  rootSelector,
  getLinkIDsByNodeID
);

export const linkedNodeIDsByNodeIDSelector = createSelector(
  rootSelector,
  getLinkedNodeIDsByNodeID
);

export const linksByNodeIDSelector = createSelector(
  allLinksByIDsSelector,
  linkIDsByNodeIDSelector,
  (getLinks, getLinkIDs) => (nodeID) => getLinks(getLinkIDs(nodeID))
);

export const hasLinksByNodeIDSelector = createSelector(
  linksByNodeIDSelector,
  (getLinks) => (nodeID) => !!getLinks(nodeID).length
);

export const linkIDsByPortIDSelector = createSelector(
  rootSelector,
  getLinkIDsByPortID
);

export const linksByPortIDSelector = createSelector(
  allLinksByIDsSelector,
  linkIDsByPortIDSelector,
  (getLinks, getLinkIDs) => (portID) => getLinks(getLinkIDs(portID))
);

export const hasLinksByPortIDSelector = createSelector(
  linksByPortIDSelector,
  (getLinks) => (portID) => !!getLinks(portID).length
);

export const focusSelector = createSelector(
  rootSelector,
  ({ focus }) => focus
);

export const focusedNodeSelector = createSelector(
  nodeByIDSelector,
  focusSelector,
  (getNodeByID, focus) => focus.target && getNodeByID(focus.target)
);

// action creators

export const initializeCreator = (payload) => createAction(INITIALIZE_CREATOR, payload);

export const resetCreator = () => createAction(RESET_CREATOR);

export const updateNodeData = (nodeID, data, patch = true) => createAction(UPDATE_NODE_DATA, { nodeID, data, patch });

export const updateNodeLocation = (nodeID, [x, y]) => createAction(UPDATE_NODE_LOCATION, { nodeID, x, y });

/**
 * merge two nodes together
 *
 * @param {string} sourceNodeID the node that was dropped
 * @param {string} targetNodeID the node on which the source node was dropped
 * @param {boolean} invert if true then the dropped node should be the first node in the combined block
 * @param {string} mergedNodeID the ID of the resulting combined node
 * @returns {*} a MERGE_NODES action
 */
export const mergeNodes = (sourceNodeID, targetNodeID, invert, mergedNodeID = cuid()) =>
  createAction(MERGE_NODES, { sourceNodeID, targetNodeID, invert, mergedNodeID });

export const unmergeNode = (nodeID, position) => createAction(UNMERGE_NODE, { nodeID, position });

export const insertNestedNode = (parentNodeID, index, nodeID) => createAction(INSERT_NESTED_NODE, { parentNodeID, nodeID, index });

export const addNode = (node, data, nodeID = cuid()) => createAction(ADD_NODE, { node: { ...node, id: nodeID }, data });

export const addManyNodes = (nodeGroup, position) => createAction(ADD_MANY_NODES, { nodeGroup, position });

export const addNestedNode = (parentNodeID, node, data, nodeID = cuid()) =>
  createAction(ADD_NESTED_NODE, { parentNodeID, node: { ...node, id: nodeID }, data });

export const reorderNestedNodes = (nodeID, sourceIndex, targetIndex) => createAction(REORDER_NESTED_NODES, { nodeID, sourceIndex, targetIndex });

export const removeNode = (nodeID) => createAction(REMOVE_NODE, nodeID);

export const removeNodes = (nodeIDs) => createAction(REMOVE_MANY_NODES, nodeIDs);

export const addPort = (nodeID, portID, port) => createAction(ADD_PORT, { nodeID, portID, port });

export const removePort = (portID) => createAction(REMOVE_PORT, portID);

export const addLink = (sourcePortID, targetPortID, linkID) => createAction(ADD_LINK, { sourcePortID, targetPortID, linkID });

export const removeLink = (linkID) => createAction(REMOVE_LINK, linkID);

export const setFocus = (nodeID, renameActiveRevision = null) => createAction(SET_FOCUS, { nodeID, renameActiveRevision });

export const removeHiddenLinks = (platform) => createAction(REMOVE_HIDDEN_LINKS, platform);

export const clearFocus = () => createAction(CLEAR_FOCUS);

// side effects

export const updateViewport = (viewport) => async (dispatch, getState) => {
  const diagramID = creatorDiagramIDSelector(getState());

  dispatch(updateViewportForDiagram(diagramID, viewport));
};
