import { createAction } from '@/ducks/utils';

import { LockAction, LockType } from './constants';

// actions
export const RECONNECT_NOOP = 'REALTIME:SOCKET:RECONNECT:NOOP';

export const LOCK_NODES = 'REALTIME:SOCKET:NODE:LOCK';
export const UNLOCK_NODES = 'REALTIME:SOCKET:NODE:UNLOCK';
export const ADD_NODE = 'REALTIME:SOCKET:NODE:ADD';
export const ADD_MANY_NODES = 'REALTIME:SOCKET:NODE:ADD_MANY';
export const ADD_NESTED_NODE = 'REALTIME:SOCKET:NODE:ADD_NESTED';
export const INSERT_NESTED_NODE = 'REALTIME:SOCKET:NODE:INSERT_NESTED';
export const UNMERGE_NODE = 'REALTIME:SOCKET:NODE:UNMERGE';
export const MERGE_NODES = 'REALTIME:SOCKET:NODE:MERGE';
export const REMOVE_NODE = 'REALTIME:SOCKET:NODE:REMOVE';
export const REMOVE_MANY_NODES = 'REALTIME:SOCKET:NODE:REMOVE_MANY';
export const UPDATE_NODE_DATA = 'REALTIME:SOCKET:NODE:UPDATE_DATA';
export const MOVE_NODE = 'REALTIME:SOCKET:NODE:MOVE';
export const MOVE_MANY_NODES = 'REALTIME:SOCKET:NODE:MOVE_MANY';

export const ADD_PORT = 'REALTIME:SOCKET:PORT:ADD';
export const REMOVE_PORT = 'REALTIME:SOCKET:PORT:REMOVE';

export const MOVE_LINK = 'REALTIME:SOCKET:LINK:MOVE';
export const ADD_LINK = 'REALTIME:SOCKET:LINK:ADD';
export const REMOVE_LINK = 'REALTIME:SOCKET:LINK:REMOVE';

export const MOVE_MOUSE = 'REALTIME:SOCKET:MOUSE:MOVE';

export const LOCK_RESOURCE = 'REALTIME:PROJECT:SOCKET:RESOURCE:LOCK';
export const UNLOCK_RESOURCE = 'REALTIME:PROJECT:SOCKET:RESOURCE:UNLOCK';
export const UPDATE_RESOURCE = 'REALTIME:PROJECT:SOCKET:RESOURCE:UPDATE';

// action creators

const createLockAction = (type, payload, meta) => createAction(type, payload, { ...meta, lock: payload });

export const lockNodes = (nodeIDs, lockTypes) => createLockAction(LOCK_NODES, { targets: nodeIDs, types: lockTypes, action: LockAction.LOCK });
export const unlockNodes = (nodeIDs, lockTypes) => createLockAction(UNLOCK_NODES, { targets: nodeIDs, types: lockTypes, action: LockAction.UNLOCK });

export const reconnectNoop = () => createAction(RECONNECT_NOOP);

export const addNode = (node, data, nodeID) => createAction(ADD_NODE, { node, data, nodeID });
export const addManyNodes = (nodeGroup, position) => createAction(ADD_MANY_NODES, { nodeGroup, position });
export const addNestedNode = (parentNodeID, nodeID, node, data, mergedNodeID) =>
  createAction(ADD_NESTED_NODE, { parentNodeID, nodeID, node, data, mergedNodeID });
export const insertNestedNode = (parentNodeID, index, nodeID) => createAction(INSERT_NESTED_NODE, { parentNodeID, index, nodeID });
export const unmergeNode = (nodeID, position) => createAction(UNMERGE_NODE, { nodeID, position });
export const mergeNodes = (mergedNodeID, sourceNodeID, targetNodeID, position) =>
  createAction(MERGE_NODES, { mergedNodeID, sourceNodeID, targetNodeID, position });
export const removeNode = (nodeID) => createAction(REMOVE_NODE, nodeID);
export const removeManyNodes = (nodeIDs) => createAction(REMOVE_MANY_NODES, nodeIDs);
export const updateNodeData = (nodeID, data) => createAction(UPDATE_NODE_DATA, { nodeID, data });
export const moveNode = (nodeID, movement, origin) => createAction(MOVE_NODE, { nodeID, movement, origin });
export const moveManyNodes = (nodeIDs, movement, origins) => createAction(MOVE_MANY_NODES, { nodeIDs, movement, origins });

export const addPort = (nodeID, portID, port) => createAction(ADD_PORT, { nodeID, portID, port });
export const removePort = (portID) => createAction(REMOVE_PORT, portID);

export const moveLink = (linkData) => createAction(MOVE_LINK, linkData);
export const addLink = (sourcePortID, targetPortID, linkID) => createAction(ADD_LINK, { sourcePortID, targetPortID, linkID });
export const removeLink = (linkID) => createAction(REMOVE_LINK, linkID);

export const moveMouse = (position) => createAction(MOVE_MOUSE, position);

export const lockResource = (resourceID) =>
  createLockAction(LOCK_RESOURCE, { targets: [resourceID], types: [LockType.RESOURCE], action: LockAction.LOCK });
export const unlockResource = (resourceID) =>
  createLockAction(UNLOCK_RESOURCE, { targets: [resourceID], types: [LockType.RESOURCE], action: LockAction.UNLOCK });
export const updateResource = (resourceID, data) => createAction(UPDATE_RESOURCE, { resourceID, data });
