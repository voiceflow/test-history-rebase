import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import { DiagramState } from '@/constants';
import { createAction } from '@/ducks/utils';
import { EntityMap, PartialModel } from '@/models';
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
  REMOVE_MANY_NODES = 'CREATOR:NODE:REMOVE_MANY',
  ADD_OUT_DYNAMIC_PORT = 'CREATOR:PORT:ADD_OUT_DYNAMIC',
  ADD_OUT_BUILT_IN_PORT = 'CREATOR:PORT:ADD_OUT_BUILT_IN',
  REMOVE_OUT_DYNAMIC_PORT = 'CREATOR:PORT:REMOVE_OUT_DYNAMIC',
  REMOVE_OUT_BUILT_IN_PORT = 'CREATOR:PORT:REMOVE_OUT_BUILT_IN',
  REORDER_OUT_DYNAMIC_PORTS = 'CREATOR:PORT:REORDER_OUT_DYNAMIC',
  ADD_LINK = 'CREATOR:LINK:ADD',
  REMOVE_LINK = 'CREATOR:LINK:REMOVE',
  UNDO_HISTORY = 'CREATOR:HISTORY:UNDO',
  REDO_HISTORY = 'CREATOR:HISTORY:REDO',
  SAVE_HISTORY = 'CREATOR:HISTORY:SAVE',
  SET_SECTION_STATE = 'CREATOR:SECTION_STATE:SET',
  SET_DIAGRAM_STATE = 'CREATOR:DIAGRAM_STATE:SET',
  UPDATE_HIDDEN = 'CREATOR:HIDDEN:UPDATE',
  UPDATE_LINK_DATA = 'CREATOR:NODE:UPDATE_LINK_DATA',
  UPDATE_LINK_DATA_MANY = 'CREATOR:NODE:UPDATE_LINK_DATA_MANY',
  RESET_LOADED = 'CREATOR:IS_LOADED:RESET',
}

// action types

export type UpdateNodeData = Action<
  DiagramAction.UPDATE_NODE_DATA,
  { nodeID: string; data: Partial<Realtime.NodeData<unknown>>; patch: true } | { nodeID: string; data: Realtime.NodeData<unknown>; patch: false }
>;

export type UpdateNodeLocation = Action<DiagramAction.UPDATE_NODE_LOCATION, { nodeID: string; x: number; y: number }>;

export type UpdateLinkData = Action<DiagramAction.UPDATE_LINK_DATA, { linkID: string; data: Partial<Realtime.LinkData> }>;

export type UpdateLinkDataMany = Action<DiagramAction.UPDATE_LINK_DATA_MANY, { linkID: string; data: Partial<Realtime.LinkData> }[]>;

export type UnmergeNode = Action<DiagramAction.UNMERGE_NODE, { nodeID: string; position: Point; parentNode: ParentNodeDescriptor }>;

export type InsertNestedNode = Action<DiagramAction.INSERT_NESTED_NODE, { parentNodeID: string; nodeID: string; index: number }>;

export type AddNode = Action<DiagramAction.ADD_NODE, { node: NodeDescriptor; data: DataDescriptor }>;

export type AddManyNodes = Action<DiagramAction.ADD_MANY_NODES, { entities: EntityMap; position: Point }>;

export type AddNestedNode = Action<
  DiagramAction.ADD_NESTED_NODE,
  {
    node: NodeDescriptor;
    data: DataDescriptor;
    parentNodeID: string;
    mergedNodeID: string;
  }
>;

export type AddWrappedNode = Action<DiagramAction.ADD_WRAPPED_NODE, { node: NodeDescriptor; data: DataDescriptor; parentNode: ParentNodeDescriptor }>;

export type RemoveManyNodes = Action<DiagramAction.REMOVE_MANY_NODES, string[]>;

export type AddOutDynamicPort = Action<DiagramAction.ADD_OUT_DYNAMIC_PORT, { nodeID: string; port: PartialModel<Realtime.Port> }>;

export type AddOutBuiltInPort = Action<
  DiagramAction.ADD_OUT_BUILT_IN_PORT,
  { nodeID: string; port: PartialModel<Realtime.Port>; portType: Models.PortType }
>;

export type RemoveOutDynamicPort = Action<DiagramAction.REMOVE_OUT_DYNAMIC_PORT, string>;

export type RemoveOutBuiltInPort = Action<DiagramAction.REMOVE_OUT_BUILT_IN_PORT, { portID: string; portType: Models.PortType }>;

export type ReorderOutDynamicPorts = Action<DiagramAction.REORDER_OUT_DYNAMIC_PORTS, { nodeID: string; from: number; to: number }>;

export type AddLink = Action<DiagramAction.ADD_LINK, { sourcePortID: string; targetPortID: string; linkID: string }>;

export type RemoveLink = Action<DiagramAction.REMOVE_LINK, string>;

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
  | UpdateLinkData
  | UpdateLinkDataMany
  | UnmergeNode
  | InsertNestedNode
  | AddNode
  | AddManyNodes
  | AddNestedNode
  | AddWrappedNode
  | RemoveManyNodes
  | AddOutDynamicPort
  | AddOutBuiltInPort
  | RemoveOutDynamicPort
  | RemoveOutBuiltInPort
  | ReorderOutDynamicPorts
  | AddLink
  | RemoveLink
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

export const updateLinkData = (linkID: string, data: Partial<Realtime.LinkData>): UpdateLinkData =>
  createAction(DiagramAction.UPDATE_LINK_DATA, { linkID, data });

export const updateLinkDataMany = (payload: { linkID: string; data: Partial<Realtime.LinkData> }[]): UpdateLinkDataMany =>
  createAction(DiagramAction.UPDATE_LINK_DATA_MANY, payload);

export const unmergeNode = (nodeID: string, position: Point, parentNode: ParentNodeDescriptor): UnmergeNode =>
  createAction(DiagramAction.UNMERGE_NODE, { nodeID, position, parentNode });

export const insertNestedNode = (parentNodeID: string, index: number, nodeID: string): InsertNestedNode =>
  createAction(DiagramAction.INSERT_NESTED_NODE, { parentNodeID, nodeID, index });

export const addNode = (node: NodeDescriptor, data: DataDescriptor): AddNode => createAction(DiagramAction.ADD_NODE, { node, data });

export const addManyNodes = (entities: EntityMap, position: Point): AddManyNodes =>
  createAction(DiagramAction.ADD_MANY_NODES, { entities, position });

export const addNestedNode = (parentNodeID: string, node: NodeDescriptor, data: DataDescriptor, mergedNodeID: string): AddNestedNode =>
  createAction(DiagramAction.ADD_NESTED_NODE, {
    parentNodeID,
    node,
    data,
    mergedNodeID,
  });

export const addWrappedNode = (node: NodeDescriptor, data: DataDescriptor, parentNode: ParentNodeDescriptor): AddWrappedNode =>
  createAction(DiagramAction.ADD_WRAPPED_NODE, { node, data, parentNode });

export const removeNodes = (nodeIDs: string[]): RemoveManyNodes => createAction(DiagramAction.REMOVE_MANY_NODES, nodeIDs);

export const addOutDynamicPort = (nodeID: string, port: PartialModel<Realtime.Port>): AddOutDynamicPort =>
  createAction(DiagramAction.ADD_OUT_DYNAMIC_PORT, { nodeID, port });

export const addOutBuiltInPort = (nodeID: string, portType: Models.PortType, port: PartialModel<Realtime.Port>): AddOutBuiltInPort =>
  createAction(DiagramAction.ADD_OUT_BUILT_IN_PORT, { nodeID, port, portType });

export const removeOutBuiltInPort = (portType: Models.PortType, portID: string): RemoveOutBuiltInPort =>
  createAction(DiagramAction.REMOVE_OUT_BUILT_IN_PORT, { portType, portID });

export const removeOutDynamicPort = (portID: string): RemoveOutDynamicPort => createAction(DiagramAction.REMOVE_OUT_DYNAMIC_PORT, portID);

export const reorderOutDynamicPort = (nodeID: string, from: number, to: number): ReorderOutDynamicPorts =>
  createAction(DiagramAction.REORDER_OUT_DYNAMIC_PORTS, { nodeID, from, to });

export const addLink = (sourcePortID: string, targetPortID: string, linkID: string): AddLink =>
  createAction(DiagramAction.ADD_LINK, { sourcePortID, targetPortID, linkID });

export const removeLink = (linkID: string): RemoveLink => createAction(DiagramAction.REMOVE_LINK, linkID);

export const undoHistory = (): UndoHistory => createAction(DiagramAction.UNDO_HISTORY);

export const redoHistory = (): RedoHistory => createAction(DiagramAction.REDO_HISTORY);

export const saveHistory = ({ force, preventUpdate }: { force?: boolean; preventUpdate?: boolean } = {}): SaveHistory =>
  createAction(DiagramAction.SAVE_HISTORY, null, { force, preventUpdate });

export const setSectionState = (key: string, value: unknown): SetSectionState => createAction(DiagramAction.SET_SECTION_STATE, { key, value });

export const setDiagramState = (state: DiagramState): SetDiagramState => createAction(DiagramAction.SET_DIAGRAM_STATE, state);

export const showCanvas = (): UpdateHidden => createAction(DiagramAction.UPDATE_HIDDEN, false);

export const hideCanvas = (): UpdateHidden => createAction(DiagramAction.UPDATE_HIDDEN, true);

export const resetLoaded = (): ResetLoaded => createAction(DiagramAction.RESET_LOADED);
