import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import * as Redux from 'redux';
import undoable, { includeAction } from 'redux-undo';
import { isType } from 'typescript-fsa';

import { DiagramState } from '@/constants';
import { Reducer, RootReducer } from '@/store/types';
import reduxBatchUndo from '@/utils/reduxBatchUndo';

import { AnyCreatorAction, CreatorAction, InitializeCreator } from '../../actions';
import {
  AddOutBuiltInPort,
  AddOutDynamicPort,
  AnyDiagramAction,
  DiagramAction,
  RemoveLink,
  removeNodes,
  RemoveOutBuiltInPort,
  RemoveOutDynamicPort,
  ReorderOutDynamicPorts,
  SetDiagramState,
  SetSectionState,
  UpdateHidden,
  UpdateLinkData,
  UpdateLinkDataMany,
  UpdateNodeData,
  UpdateNodeLocation,
} from '../actions';
import { INITIAL_DIAGRAM_STATE } from '../constants';
import { portFactory } from '../factories';
import { DiagramState as DiagramStateType } from '../types';
import {
  addOutBuiltInPortToBlockInState,
  addOutDynamicPortToBlockInState,
  buildLinkedNodesByNodeID,
  buildLinksByNodeID,
  buildLinksByPortID,
  getLinkIDsByPortID,
  patchLinkInState,
  patchNodeInState,
  patchPortInState,
  removeAllLinksFromState,
  removeLinkFromState,
  removeOutBuiltInPortFromBlockInState,
  removeOutDynamicPortFromBlockInState,
  reorderOutDynamicPorts,
} from '../utils';
import addLinkReducer from './addLink';
import addNodeReducer, { addManyNodesReducer, addNestedNodeReducer, addWrappedNodeReducer } from './addNode';
import insertNestedNodeReducer from './insertNestedNode';
import { removeManyNodesReducer } from './removeNode';
import unmergeNodeReducer from './unmergeNode';

// reducers

export const initializeCreatorReducer: Reducer<DiagramStateType, InitializeCreator> = (
  state,
  { payload: { diagramID, rootNodeIDs, nodes, links, ports, data, markupNodeIDs } }
): DiagramStateType => ({
  ...state,
  diagramID,
  rootNodeIDs,
  data,
  ports: Utils.normalized.normalize(ports),
  nodes: Utils.normalized.normalize(nodes),
  links: Utils.normalized.normalize(links),
  linksByPortID: buildLinksByPortID(links),
  linksByNodeID: buildLinksByNodeID(links),
  linkedNodesByNodeID: buildLinkedNodesByNodeID(links),
  sections: {},
  markupNodeIDs,
  diagramState: DiagramState.IDLE,
});

export const updateNodeDataReducer: Reducer<DiagramStateType, UpdateNodeData> = (state, { payload: { nodeID, data, patch } }) => {
  if (Object.prototype.hasOwnProperty.call(state.data, nodeID)) {
    return {
      ...state,
      data: {
        ...state.data,
        [nodeID]: patch ? { ...state.data[nodeID], ...data } : (data as Realtime.NodeData<unknown>),
      },
    };
  }

  return state;
};

export const updateNodeLocationReducer: Reducer<DiagramStateType, UpdateNodeLocation> = (state, { payload: { nodeID, x, y } }) =>
  patchNodeInState(nodeID, { x, y })(state);

export const updateLinkDataReducer: Reducer<DiagramStateType, UpdateLinkData> = (state, { payload: { linkID, data } }) => {
  const link = state.links.byKey[linkID];

  if (!link) {
    return state;
  }

  return Utils.functional.compose(
    patchLinkInState(linkID, { data: { ...link.data, ...data } }),
    patchPortInState(link.source.portID, { linkData: { ...link.data, ...data } })
  )(state);
};

export const updateLinkDataManyReducer: Reducer<DiagramStateType, UpdateLinkDataMany> = (state, { payload }) =>
  payload.reduce((nextState, { linkID, data }) => {
    const link = nextState.links.byKey[linkID];

    if (!link) {
      return state;
    }

    return Utils.functional.compose(
      patchLinkInState(linkID, { data: { ...link.data, ...data } }),
      patchPortInState(link.source.portID, { linkData: { ...link.data, ...data } })
    )(nextState);
  }, state);

export const addOutDynamicPortReducer: Reducer<DiagramStateType, AddOutDynamicPort> = (state, { payload: { nodeID, port } }) =>
  addOutDynamicPortToBlockInState(portFactory(nodeID, port.id, port))(state);

export const addOutBuiltInPortReducer: Reducer<DiagramStateType, AddOutBuiltInPort> = (state, { payload: { nodeID, port, portType } }) =>
  addOutBuiltInPortToBlockInState(portType, portFactory(nodeID, port.id, port))(state);

export const removeOutDynamicPortReducer: Reducer<DiagramStateType, RemoveOutDynamicPort> = (state, { payload: portID }) =>
  Utils.functional.compose(removeOutDynamicPortFromBlockInState(portID), removeAllLinksFromState(getLinkIDsByPortID(state)(portID)))(state);

export const removeOutBuiltInPortReducer: Reducer<DiagramStateType, RemoveOutBuiltInPort> = (state, { payload: { portID, portType } }) =>
  Utils.functional.compose(removeOutBuiltInPortFromBlockInState(portType, portID), removeAllLinksFromState(getLinkIDsByPortID(state)(portID)))(state);

export const reorderOurDynamicPortsReducer: Reducer<DiagramStateType, ReorderOutDynamicPorts> = (state, { payload: { nodeID, from, to } }) =>
  reorderOutDynamicPorts(nodeID, from, to)(state);

export const removeLinkReducer: Reducer<DiagramStateType, RemoveLink> = (state, { payload: linkID }) => removeLinkFromState(linkID)(state);

export const setSectionStateReducer: Reducer<DiagramStateType, SetSectionState> = (state, { payload: { key, value } }) => {
  if (value == null) {
    const { [key]: _, ...nextState } = state.sections;

    return {
      ...state,
      sections: nextState,
    };
  }

  return {
    ...state,
    sections: {
      ...state.sections,
      [key]: value,
    },
  };
};

export const setDiagramStateReducer: Reducer<DiagramStateType, SetDiagramState> = (state, { payload }) => ({
  ...state,
  diagramState: payload,
});

export const updateHiddenReducer: Reducer<DiagramStateType, UpdateHidden> = (state, { payload }) => ({
  ...state,
  hidden: payload,
});

const creatorDiagramReducer: RootReducer<DiagramStateType, AnyDiagramAction | AnyCreatorAction> = (state = INITIAL_DIAGRAM_STATE, action) => {
  if (isType(action, Realtime.node.removeMany)) {
    return removeManyNodesReducer(state, removeNodes(action.payload.nodeIDs));
  }

  switch (action.type) {
    case CreatorAction.INITIALIZE_CREATOR:
      return initializeCreatorReducer(state, action);
    case CreatorAction.RESET_CREATOR:
      return INITIAL_DIAGRAM_STATE;
    case DiagramAction.UPDATE_NODE_DATA:
      return updateNodeDataReducer(state, action);
    case DiagramAction.UPDATE_NODE_LOCATION:
      return updateNodeLocationReducer(state, action);
    case DiagramAction.UPDATE_LINK_DATA:
      return updateLinkDataReducer(state, action);
    case DiagramAction.UPDATE_LINK_DATA_MANY:
      return updateLinkDataManyReducer(state, action);
    case DiagramAction.UNMERGE_NODE:
      return unmergeNodeReducer(state, action);
    case DiagramAction.INSERT_NESTED_NODE:
      return insertNestedNodeReducer(state, action);
    case DiagramAction.ADD_NODE:
      return addNodeReducer(state, action);
    case DiagramAction.ADD_MANY_NODES:
      return addManyNodesReducer(state, action);
    case DiagramAction.ADD_NESTED_NODE:
      return addNestedNodeReducer(state, action);
    case DiagramAction.ADD_WRAPPED_NODE:
      return addWrappedNodeReducer(state, action);
    case DiagramAction.REMOVE_MANY_NODES:
      return removeManyNodesReducer(state, action);
    case DiagramAction.ADD_OUT_DYNAMIC_PORT:
      return addOutDynamicPortReducer(state, action);
    case DiagramAction.ADD_OUT_BUILT_IN_PORT:
      return addOutBuiltInPortReducer(state, action);
    case DiagramAction.REMOVE_OUT_DYNAMIC_PORT:
      return removeOutDynamicPortReducer(state, action);
    case DiagramAction.REMOVE_OUT_BUILT_IN_PORT:
      return removeOutBuiltInPortReducer(state, action);
    case DiagramAction.REORDER_OUT_DYNAMIC_PORTS:
      return reorderOurDynamicPortsReducer(state, action);
    case DiagramAction.ADD_LINK:
      return addLinkReducer(state, action);
    case DiagramAction.REMOVE_LINK:
      return removeLinkReducer(state, action);
    case DiagramAction.SET_SECTION_STATE:
      return setSectionStateReducer(state, action);
    case DiagramAction.SET_DIAGRAM_STATE:
      return setDiagramStateReducer(state, action);
    case DiagramAction.UPDATE_HIDDEN:
      return updateHiddenReducer(state, action);
    case DiagramAction.RESET_LOADED:
      return { ...state, diagramID: null };
    default:
      return state;
  }
};

export default undoable(creatorDiagramReducer as Redux.Reducer<DiagramStateType>, {
  filter: includeAction(DiagramAction.SAVE_HISTORY),
  groupBy: reduxBatchUndo.init(),
  undoType: DiagramAction.UNDO_HISTORY,
  redoType: DiagramAction.REDO_HISTORY,
  initTypes: ['@@redux-undo/INIT', CreatorAction.RESET_CREATOR],
  ignoreInitialState: true,
  limit: 25,
});
