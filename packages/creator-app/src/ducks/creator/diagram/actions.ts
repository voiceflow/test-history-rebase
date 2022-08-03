import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { DiagramState } from '@/constants';
import { createAction } from '@/ducks/utils';
import { Action } from '@/store/types';
import { Point } from '@/types';

import { DataDescriptor, NodeDescriptor, ParentNodeDescriptor } from './types';

export enum DiagramAction {
  UPDATE_NODE_DATA = 'CREATOR:NODE:UPDATE_DATA',
  UPDATE_NODE_LOCATION = 'CREATOR:NODE:UPDATE_LOCATION',
  UNMERGE_NODE = 'CREATOR:NODE:UNMERGE',
  INSERT_NESTED_NODE = 'CREATOR:NODE:INSERT_NESTED',
  ADD_NODE = 'CREATOR:NODE:ADD',
  ADD_MANY_NODES = 'CREATOR:NODE:ADD_MANY',
  ADD_NESTED_NODE = 'CREATOR:NODE:ADD_NESTED',
  ADD_MARKUP_NODE = 'CREATOR:NODE:ADD_MARKUP',
  ADD_WRAPPED_NODE = 'CREATOR:NODE:ADD_WRAPPED',
  ADD_ACTIONS_NODE = 'CREATOR:NODE:ADD_ACTIONS',
  REMOVE_MANY_NODES = 'CREATOR:NODE:REMOVE_MANY',
  ADD_OUT_BY_KEY_PORT = 'CREATOR:PORT:ADD_OUT_BY_KEY',
  ADD_OUT_DYNAMIC_PORT = 'CREATOR:PORT:ADD_OUT_DYNAMIC',
  ADD_OUT_BUILT_IN_PORT = 'CREATOR:PORT:ADD_OUT_BUILT_IN',
  REMOVE_MANY_OUT_BY_KEY_PORT = 'CREATOR:PORT:REMOVE_MANY_OUT_BY_KEY',
  REMOVE_OUT_DYNAMIC_PORT = 'CREATOR:PORT:REMOVE_OUT_DYNAMIC',
  REMOVE_OUT_BUILT_IN_PORT = 'CREATOR:PORT:REMOVE_OUT_BUILT_IN',
  REORDER_OUT_DYNAMIC_PORTS = 'CREATOR:PORT:REORDER_OUT_DYNAMIC',
  ADD_LINK = 'CREATOR:LINK:ADD',
  REMOVE_MANY_LINKS = 'CREATOR:LINK:REMOVE_MANY',
  UNDO_HISTORY = 'CREATOR:HISTORY:UNDO',
  REDO_HISTORY = 'CREATOR:HISTORY:REDO',
  SAVE_HISTORY = 'CREATOR:HISTORY:SAVE',
  SET_SECTION_STATE = 'CREATOR:SECTION_STATE:SET',
  SET_DIAGRAM_STATE = 'CREATOR:DIAGRAM_STATE:SET',
  UPDATE_HIDDEN = 'CREATOR:HIDDEN:UPDATE',
  UPDATE_LINK_DATA_MANY = 'CREATOR:NODE:UPDATE_LINK_DATA_MANY',
  RESET_LOADED = 'CREATOR:IS_LOADED:RESET',
}

// action types

export type UpdateNodeData = Action<
  DiagramAction.UPDATE_NODE_DATA,
  { nodeID: string; data: Partial<Realtime.NodeData<unknown>>; patch: true } | { nodeID: string; data: Realtime.NodeData<unknown>; patch: false }
>;

export type UpdateNodeLocation = Action<DiagramAction.UPDATE_NODE_LOCATION, { nodeID: string; x: number; y: number }>;

export type UpdateLinkDataMany = Action<DiagramAction.UPDATE_LINK_DATA_MANY, Realtime.link.LinkPatch[]>;

export type UnmergeNode = Action<DiagramAction.UNMERGE_NODE, { nodeID: string; position: Point; parentNode: ParentNodeDescriptor }>;

export type InsertNestedNode = Action<DiagramAction.INSERT_NESTED_NODE, { parentNodeID: string; nodeID: string; index: number }>;

export type AddNode = Action<DiagramAction.ADD_NODE, { node: NodeDescriptor; data: DataDescriptor }>;

export type AddManyNodes = Action<DiagramAction.ADD_MANY_NODES, { entities: Realtime.EntityMap }>;

export type AddNestedNode = Action<
  DiagramAction.ADD_NESTED_NODE,
  {
    node: NodeDescriptor;
    data: DataDescriptor;
    parentNodeID: string;
  }
>;

export type AddWrappedNode = Action<DiagramAction.ADD_WRAPPED_NODE, { node: NodeDescriptor; data: DataDescriptor; parentNode: ParentNodeDescriptor }>;

export type AddActionsNode = Action<DiagramAction.ADD_ACTIONS_NODE, { node: NodeDescriptor; data: DataDescriptor; parentNode: ParentNodeDescriptor }>;

export type RemoveManyNodes = Action<DiagramAction.REMOVE_MANY_NODES, string[]>;

export type AddOutByKeyPort = Action<DiagramAction.ADD_OUT_BY_KEY_PORT, { nodeID: string; port: Realtime.PartialModel<Realtime.Port>; key: string }>;

export type AddOutDynamicPort = Action<
  DiagramAction.ADD_OUT_DYNAMIC_PORT,
  { nodeID: string; port: Realtime.PartialModel<Realtime.Port>; index?: number }
>;

export type AddOutBuiltInPort = Action<
  DiagramAction.ADD_OUT_BUILT_IN_PORT,
  { nodeID: string; port: Realtime.PartialModel<Realtime.Port>; portType: BaseModels.PortType }
>;

export type RemoveManyOutByKeyPorts = Action<DiagramAction.REMOVE_MANY_OUT_BY_KEY_PORT, { key: string; portID: string }[]>;

export type RemoveOutDynamicPort = Action<DiagramAction.REMOVE_OUT_DYNAMIC_PORT, string>;

export type RemoveOutBuiltInPort = Action<DiagramAction.REMOVE_OUT_BUILT_IN_PORT, { portID: string; portType: BaseModels.PortType }>;

export type ReorderOutDynamicPorts = Action<DiagramAction.REORDER_OUT_DYNAMIC_PORTS, { nodeID: string; from: number; to: number }>;

export type AddLink = Action<DiagramAction.ADD_LINK, { sourcePortID: string; targetPortID: string; linkID: string }>;

export type RemoveManyLinks = Action<DiagramAction.REMOVE_MANY_LINKS, string[]>;

export type UndoHistory = Action<DiagramAction.UNDO_HISTORY>;

export type RedoHistory = Action<DiagramAction.REDO_HISTORY>;

export type SaveHistory = Action<DiagramAction.SAVE_HISTORY, null, { force?: boolean; preventUpdate?: boolean }>;

export type SetSectionState = Action<DiagramAction.SET_SECTION_STATE, { key: string; value: unknown }>;

export type SetDiagramState = Action<DiagramAction.SET_DIAGRAM_STATE, DiagramState>;

export type UpdateHidden = Action<DiagramAction.UPDATE_HIDDEN, boolean>;

export type ResetLoaded = Action<DiagramAction.RESET_LOADED>;

export type AnyDiagramAction =
  | UpdateNodeData
  | UpdateNodeLocation
  | UpdateLinkDataMany
  | UnmergeNode
  | InsertNestedNode
  | AddNode
  | AddManyNodes
  | AddNestedNode
  | AddWrappedNode
  | AddActionsNode
  | RemoveManyNodes
  | AddOutByKeyPort
  | AddOutDynamicPort
  | AddOutBuiltInPort
  | RemoveManyOutByKeyPorts
  | RemoveOutDynamicPort
  | RemoveOutBuiltInPort
  | ReorderOutDynamicPorts
  | AddLink
  | RemoveManyLinks
  | UndoHistory
  | RedoHistory
  | SaveHistory
  | SetSectionState
  | SetDiagramState
  | UpdateHidden
  | ResetLoaded;

// action creators

export const updateNodeData: {
  (nodeID: string, data: Realtime.NodeData<unknown>, patch: false): UpdateNodeData;
  (nodeID: string, data: Partial<Realtime.NodeData<unknown>>, patch?: true): UpdateNodeData;
} = (nodeID: string, data: any, patch = true): UpdateNodeData => createAction(DiagramAction.UPDATE_NODE_DATA, { nodeID, data, patch });

export const updateNodeLocation = (nodeID: string, [x, y]: Point): UpdateNodeLocation =>
  createAction(DiagramAction.UPDATE_NODE_LOCATION, { nodeID, x, y });

/**
 * @deprecated
 */
export const updateLinkDataMany = (payload: Realtime.link.LinkPatch[]): UpdateLinkDataMany =>
  createAction(DiagramAction.UPDATE_LINK_DATA_MANY, payload);

/**
 * @deprecated
 */
export const unmergeNode = (nodeID: string, position: Point, parentNode: ParentNodeDescriptor): UnmergeNode =>
  createAction(DiagramAction.UNMERGE_NODE, { nodeID, position, parentNode });

/**
 * @deprecated
 */
export const insertNestedNode = (parentNodeID: string, index: number, nodeID: string): InsertNestedNode =>
  createAction(DiagramAction.INSERT_NESTED_NODE, { parentNodeID, nodeID, index });

/**
 * @deprecated
 */
export const addNode = (node: NodeDescriptor, data: DataDescriptor): AddNode => createAction(DiagramAction.ADD_NODE, { node, data });

export const addManyNodes = (entities: Realtime.EntityMap): AddManyNodes => createAction(DiagramAction.ADD_MANY_NODES, { entities });

/**
 * @deprecated
 */
export const addNestedNode = (parentNodeID: string, node: NodeDescriptor, data: DataDescriptor): AddNestedNode =>
  createAction(DiagramAction.ADD_NESTED_NODE, {
    parentNodeID,
    node,
    data,
  });

/**
 * @deprecated
 */
export const addWrappedNode = (node: NodeDescriptor, data: DataDescriptor, parentNode: ParentNodeDescriptor): AddWrappedNode =>
  createAction(DiagramAction.ADD_WRAPPED_NODE, { node, data, parentNode });

/**
 * @deprecated
 */
export const addActionsNode = (node: NodeDescriptor, data: DataDescriptor, parentNode: ParentNodeDescriptor): AddActionsNode =>
  createAction(DiagramAction.ADD_ACTIONS_NODE, { node, data, parentNode });

/**
 * @deprecated
 */
export const removeNodes = (nodeIDs: string[]): RemoveManyNodes => createAction(DiagramAction.REMOVE_MANY_NODES, nodeIDs);

/**
 * @deprecated
 */
export const addOutByKeyPort = (nodeID: string, key: string, port: Realtime.PartialModel<Realtime.Port>): AddOutByKeyPort =>
  createAction(DiagramAction.ADD_OUT_BY_KEY_PORT, { nodeID, port, key });

/**
 * @deprecated
 */
export const addOutDynamicPort = (nodeID: string, port: Realtime.PartialModel<Realtime.Port>, index?: number): AddOutDynamicPort =>
  createAction(DiagramAction.ADD_OUT_DYNAMIC_PORT, { nodeID, port, index });

/**
 * @deprecated
 */
export const addOutBuiltInPort = (nodeID: string, portType: BaseModels.PortType, port: Realtime.PartialModel<Realtime.Port>): AddOutBuiltInPort =>
  createAction(DiagramAction.ADD_OUT_BUILT_IN_PORT, { nodeID, port, portType });

/**
 * @deprecated
 */
export const removeManyOutByKeyPort = (ports: { key: string; portID: string }[]): RemoveManyOutByKeyPorts =>
  createAction(DiagramAction.REMOVE_MANY_OUT_BY_KEY_PORT, ports);

/**
 * @deprecated
 */
export const removeOutBuiltInPort = (portType: BaseModels.PortType, portID: string): RemoveOutBuiltInPort =>
  createAction(DiagramAction.REMOVE_OUT_BUILT_IN_PORT, { portType, portID });

/**
 * @deprecated
 */
export const removeOutDynamicPort = (portID: string): RemoveOutDynamicPort => createAction(DiagramAction.REMOVE_OUT_DYNAMIC_PORT, portID);

/**
 * @deprecated
 */
export const reorderOutDynamicPort = (nodeID: string, from: number, to: number): ReorderOutDynamicPorts =>
  createAction(DiagramAction.REORDER_OUT_DYNAMIC_PORTS, { nodeID, from, to });

/**
 * @deprecated
 */
export const addLink = (sourcePortID: string, targetPortID: string, linkID: string): AddLink =>
  createAction(DiagramAction.ADD_LINK, { sourcePortID, targetPortID, linkID });

/**
 * @deprecated
 */
export const removeManyLinks = (linkIDs: string[]): RemoveManyLinks => createAction(DiagramAction.REMOVE_MANY_LINKS, linkIDs);

/**
 * @deprecated
 */
export const undoHistory = (): UndoHistory => createAction(DiagramAction.UNDO_HISTORY);

/**
 * @deprecated
 */
export const redoHistory = (): RedoHistory => createAction(DiagramAction.REDO_HISTORY);

export const saveHistory = ({ force, preventUpdate }: { force?: boolean; preventUpdate?: boolean } = {}): SaveHistory =>
  createAction(DiagramAction.SAVE_HISTORY, null, { force, preventUpdate });

export const setSectionState = (key: string, value: unknown): SetSectionState => createAction(DiagramAction.SET_SECTION_STATE, { key, value });

export const setDiagramState = (state: DiagramState): SetDiagramState => createAction(DiagramAction.SET_DIAGRAM_STATE, state);

export const showCanvas = (): UpdateHidden => createAction(DiagramAction.UPDATE_HIDDEN, false);

export const hideCanvas = (): UpdateHidden => createAction(DiagramAction.UPDATE_HIDDEN, true);

export const resetLoaded = (): ResetLoaded => createAction(DiagramAction.RESET_LOADED);
