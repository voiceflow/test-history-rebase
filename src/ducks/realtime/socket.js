import { createAction } from '@/ducks/utils';

// actions

export const ADD_NODE = 'REALTIME:SOCKET:NODE:ADD';
export const COPY_NODE = 'REALTIME:SOCKET:NODE:COPY';
export const ADD_MANY_NODES = 'REALTIME:SOCKET:NODE:ADD';
export const REMOVE_NODE = 'REALTIME:SOCKET:NODE:REMOVE';
export const REMOVE_MANY_NODES = 'REALTIME:SOCKET:NODE:REMOVE_MANY';
export const UPDATE_NODE_DATA = 'REALTIME:SOCKET:NODE:UPDATE_DATA';
export const MOVE_NODE = 'REALTIME:SOCKET:NODE:MOVE';
export const MOVE_MANY_NODES = 'REALTIME:SOCKET:NODE:MOVE_MANY';

export const ADD_PORT = 'REALTIME:SOCKET:PORT:ADD';
export const REMOVE_PORT = 'REALTIME:SOCKET:PORT:REMOVE';

export const ADD_LINK = 'REALTIME:SOCKET:LINK:ADD';
export const REMOVE_LINK = 'REALTIME:SOCKET:LINK:REMOVE';

export const SET_FOCUS = 'REALTIME:SOCKET:FOCUS:SET';
export const CLEAR_FOCUS = 'REALTIME:SOCKET:FOCUS:CLEAR';

export const ADD_TO_SELECTION = 'REALTIME:SOCKET:SELECTION:ADD';
export const REMOVE_FROM_SELECTION = 'REALTIME:SOCKET:SELECTION:REMOVE';
export const REPLACE_SELECTION = 'REALTIME:SOCKET:SELECTION:REPLACE';
export const CLEAR_SELECTION = 'REALTIME:SOCKET:SELECTION:CLEAR';

export const MOVE_MOUSE = 'REALTIME:SOCKET:MOUSE:MOVE';

// action creators

export const addNode = (node, data, nodeID) => createAction(ADD_NODE, { node, data, nodeID });
export const addManyNodes = (nodeGroup, position) => createAction(ADD_MANY_NODES, { nodeGroup, position });
export const removeNode = (nodeID) => createAction(REMOVE_NODE, nodeID);
export const removeManyNodes = (nodeIDs) => createAction(REMOVE_MANY_NODES, nodeIDs);
export const updateNodeData = (nodeID, data) => createAction(UPDATE_NODE_DATA, { nodeID, data });
export const moveNode = (nodeID, movement) => createAction(MOVE_NODE, { nodeID, movement });
export const moveManyNodes = (nodeIDs, movement) => createAction(MOVE_MANY_NODES, { nodeIDs, movement });

export const addPort = (nodeID, portID, port) => createAction(ADD_PORT, { nodeID, portID, port });
export const removePort = (portID) => createAction(REMOVE_PORT, portID);

export const addLink = (sourcePortID, targetPortID, linkID) => createAction(ADD_LINK, { sourcePortID, targetPortID, linkID });
export const removeLink = (linkID) => createAction(REMOVE_LINK, linkID);

export const setFocus = (nodeID, renameActiveRevision = null) => createAction(SET_FOCUS, { nodeID, renameActiveRevision });
export const clearFocus = () => createAction(CLEAR_FOCUS);

export const addToSelection = (nodeID) => createAction(ADD_TO_SELECTION, nodeID);
export const removeFromSelection = (nodeID) => createAction(REMOVE_FROM_SELECTION, nodeID);
export const replaceSelection = (nodeIDs) => createAction(REPLACE_SELECTION, nodeIDs);
export const clearSelection = () => createAction(CLEAR_SELECTION);
