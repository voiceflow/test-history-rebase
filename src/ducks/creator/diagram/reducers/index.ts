import * as Redux from 'redux';
import undoable, { includeAction } from 'redux-undo';

import { DiagramState } from '@/constants';
import { NodeData } from '@/models';
import { Reducer, RootReducer } from '@/store/types';
import { compose } from '@/utils/functional';
import { normalize } from '@/utils/normalized';

import { AnyCreatorAction, CreatorAction, InitializeCreator } from '../../actions';
import {
  AddPort,
  AnyDiagramAction,
  DiagramAction,
  RemoveLink,
  RemovePort,
  ReorderPorts,
  SetDiagramState,
  SetSectionState,
  UpdateHidden,
  UpdateNodeData,
  UpdateNodeLocation,
} from '../actions';
import { INITIAL_DIAGRAM_STATE } from '../constants';
import { portFactory } from '../factories';
import { DiagramState as DiagramStateType } from '../types';
import {
  addPortToBlockInState,
  buildLinkedNodesByNodeID,
  buildLinksByNodeID,
  buildLinksByPortID,
  getLinkIDsByPortID,
  patchNodeInState,
  removeAllLinksFromState,
  removeLinkFromState,
  removePortFromBlockInState,
  reorderNodePorts,
} from '../utils';
import addLinkReducer from './addLink';
import addNodeReducer, { addManyNodesReducer, addNestedNodeReducer, addWrappedNodeReducer } from './addNode';
import insertNestedNodeReducer from './insertNestedNode';
import removeNodeReducer, { removeManyNodesReducer } from './removeNode';
import unmergeNodeReducer from './unmergeNode';

// reducers

export const initializeCreatorReducer: Reducer<DiagramStateType, InitializeCreator> = (
  state,
  { payload: { diagramID, rootNodeIDs, nodes, links, ports, data, markupNodeIDs } }
) => ({
  ...state,
  diagramID,
  rootNodeIDs,
  data,
  ports: normalize(ports),
  nodes: normalize(nodes),
  links: normalize(links),
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
        [nodeID]: patch ? { ...state.data[nodeID], ...data } : (data as NodeData<unknown>),
      },
    };
  }

  return state;
};

export const updateNodeLocationReducer: Reducer<DiagramStateType, UpdateNodeLocation> = (state, { payload: { nodeID, x, y } }) =>
  patchNodeInState(nodeID, { x, y })(state);

export const addPortReducer: Reducer<DiagramStateType, AddPort> = (state, { payload: { nodeID, port } }) =>
  addPortToBlockInState(portFactory(nodeID, port.id, port))(state);

export const removePortReducer: Reducer<DiagramStateType, RemovePort> = (state, { payload: portID }) =>
  compose(removePortFromBlockInState(portID), removeAllLinksFromState(getLinkIDsByPortID(state)(portID)))(state);

export const reorderPortsReducer: Reducer<DiagramStateType, ReorderPorts> = (state, { payload: { nodeID, from, to } }) =>
  reorderNodePorts(nodeID, from, to)(state);

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
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case CreatorAction.INITIALIZE_CREATOR:
      return initializeCreatorReducer(state, action);
    case CreatorAction.RESET_CREATOR:
      return INITIAL_DIAGRAM_STATE;
    case DiagramAction.UPDATE_NODE_DATA:
      return updateNodeDataReducer(state, action);
    case DiagramAction.UPDATE_NODE_LOCATION:
      return updateNodeLocationReducer(state, action);
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
    case DiagramAction.REMOVE_NODE:
      return removeNodeReducer(state, action);
    case DiagramAction.REMOVE_MANY_NODES:
      return removeManyNodesReducer(state, action);
    case DiagramAction.ADD_PORT:
      return addPortReducer(state, action);
    case DiagramAction.REMOVE_PORT:
      return removePortReducer(state, action);
    case DiagramAction.REORDER_PORTS:
      return reorderPortsReducer(state, action);
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
    default:
      return state;
  }
};

export default undoable(creatorDiagramReducer as Redux.Reducer<DiagramStateType>, {
  undoType: DiagramAction.UNDO_HISTORY,
  redoType: DiagramAction.REDO_HISTORY,
  initTypes: ['@@redux-undo/INIT', CreatorAction.RESET_CREATOR],
  filter: includeAction(DiagramAction.SAVE_HISTORY),
  ignoreInitialState: true,
});
