import type { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';

import type * as Creator from '@/ducks/creator';
import { createAction } from '@/ducks/utils';
import { EntityMap } from '@/models';
import { Action, ActionPayload } from '@/store/types';
import { Either, Pair, Point } from '@/types';

import { LockAction, LockType, ResourceType } from './constants';
import { AnyNodeLock } from './types';

export enum SocketAction {
  RECONNECT_NOOP = 'REALTIME:SOCKET:RECONNECT:NOOP',

  LOCK_NODES = 'REALTIME:SOCKET:NODE:LOCK',
  UNLOCK_NODES = 'REALTIME:SOCKET:NODE:UNLOCK',
  ADD_NODE = 'REALTIME:SOCKET:NODE:ADD',
  ADD_MANY_NODES = 'REALTIME:SOCKET:NODE:ADD_MANY',
  ADD_NESTED_NODE = 'REALTIME:SOCKET:NODE:ADD_NESTED',
  INSERT_NESTED_NODE = 'REALTIME:SOCKET:NODE:INSERT_NESTED',
  UNMERGE_NODE = 'REALTIME:SOCKET:NODE:UNMERGE',
  REMOVE_MANY_NODES = 'REALTIME:SOCKET:NODE:REMOVE_MANY',
  UPDATE_NODE_DATA = 'REALTIME:SOCKET:NODE:UPDATE_DATA',
  MOVE_NODE = 'REALTIME:SOCKET:NODE:MOVE',
  MOVE_MANY_NODES = 'REALTIME:SOCKET:NODE:MOVE_MANY',

  ADD_OUT_DYNAMIC_PORT = 'REALTIME:SOCKET:PORT:ADD_OUT_DYNAMIC',
  ADD_OUT_BUILT_IN_PORT = 'REALTIME:SOCKET:PORT:ADD_OUT_BUILT_IN',
  REMOVE_OUT_DYNAMIC_PORT = 'REALTIME:SOCKET:PORT:REMOVE_OUT_DYNAMIC',
  REMOVE_OUT_BUILT_IN_PORT = 'REALTIME:SOCKET:PORT:REMOVE_OUT_BUILT_IN',
  REORDER_OUT_DYNAMIC_PORTS = 'REALTIME:SOCKET:PORT:REORDER_OUT_DYNAMIC',

  MOVE_LINK = 'REALTIME:SOCKET:LINK:MOVE',
  ADD_LINK = 'REALTIME:SOCKET:LINK:ADD',
  REMOVE_LINK = 'REALTIME:SOCKET:LINK:REMOVE',
  UPDATE_LINK_DATA = 'REALTIME:SOCKET:LINK:UPDATE_DATA',
  UPDATE_LINK_DATA_MANY = 'REALTIME:SOCKET:LINK:UPDATE_DATA_MANY',

  MOVE_MOUSE = 'REALTIME:SOCKET:MOUSE:MOVE',

  LOCK_RESOURCE = 'REALTIME:PROJECT:SOCKET:RESOURCE:LOCK',
  UNLOCK_RESOURCE = 'REALTIME:PROJECT:SOCKET:RESOURCE:UNLOCK',
  UPDATE_RESOURCE = 'REALTIME:PROJECT:SOCKET:RESOURCE:UPDATE',
}

export interface LockPayload<T extends string, L extends LockType, A extends LockAction> {
  targets: T[];
  types: L[];
  action: A;
}

type GenericLockAction<S extends SocketAction, T extends string, L extends LockType, A extends LockAction> = Action<
  S,
  LockPayload<T, L, A>,
  { lock: LockPayload<T, L, A> }
>;

type NodeLockAction<T extends SocketAction, L extends LockAction> = GenericLockAction<T, string, AnyNodeLock, L>;

export type ResourceLockAction<S extends SocketAction, A extends LockAction> = GenericLockAction<S, ResourceType, LockType.RESOURCE, A>;

export type ReconnectNoop = Action<SocketAction.RECONNECT_NOOP>;

export type LockNodes = NodeLockAction<SocketAction.LOCK_NODES, LockAction.LOCK>;

export type UnlockNodes = NodeLockAction<SocketAction.UNLOCK_NODES, LockAction.UNLOCK>;

export type AddNode = Action<SocketAction.ADD_NODE, ActionPayload<Creator.AddWrappedNode>>;

export type AddManyNodes = Action<SocketAction.ADD_MANY_NODES, ActionPayload<Creator.AddManyNodes>>;

export type AddNestedNode = Action<SocketAction.ADD_NESTED_NODE, ActionPayload<Creator.AddNestedNode>>;

export type InsertNestedNode = Action<SocketAction.INSERT_NESTED_NODE, ActionPayload<Creator.InsertNestedNode>>;

export type UnmergeNode = Action<SocketAction.UNMERGE_NODE, ActionPayload<Creator.UnmergeNode>>;

export type RemoveManyNodes = Action<SocketAction.REMOVE_MANY_NODES, ActionPayload<Creator.RemoveManyNodes>>;

export type UpdateNodeData = Action<SocketAction.UPDATE_NODE_DATA, Omit<ActionPayload<Creator.UpdateNodeData>, 'patch'>>;

export type MoveNode = Action<SocketAction.MOVE_NODE, { nodeID: string; movement: Pair<number>; origin: Point }>;

export type MoveManyNodes = Action<SocketAction.MOVE_MANY_NODES, { nodeIDs: string[]; movement: Pair<number>; origins: Point[] }>;

export type AddOutDynamicPort = Action<SocketAction.ADD_OUT_DYNAMIC_PORT, ActionPayload<Creator.AddOutDynamicPort>>;

export type AddOutBuiltInPort = Action<SocketAction.ADD_OUT_BUILT_IN_PORT, ActionPayload<Creator.AddOutBuiltInPort>>;

export type RemoveOutDynamicPort = Action<SocketAction.REMOVE_OUT_DYNAMIC_PORT, ActionPayload<Creator.RemoveOutDynamicPort>>;

export type RemoveOutBuiltInPort = Action<SocketAction.REMOVE_OUT_BUILT_IN_PORT, ActionPayload<Creator.RemoveOutBuiltInPort>>;

export type ReorderOutDynamicPorts = Action<SocketAction.REORDER_OUT_DYNAMIC_PORTS, ActionPayload<Creator.ReorderOutDynamicPorts>>;

export type MoveLink = Action<SocketAction.MOVE_LINK, Either<{ reset: true }, { points: Pair<Point> }>>;

export type AddLink = Action<SocketAction.ADD_LINK, ActionPayload<Creator.AddLink>>;

export type UpdateLinkData = Action<SocketAction.UPDATE_LINK_DATA, ActionPayload<Creator.UpdateLinkData>>;

export type UpdateLinkDataMany = Action<SocketAction.UPDATE_LINK_DATA_MANY, ActionPayload<Creator.UpdateLinkDataMany>>;

export type RemoveLink = Action<SocketAction.REMOVE_LINK, ActionPayload<Creator.RemoveLink>>;

export type MoveMouse = Action<SocketAction.MOVE_MOUSE, Point>;

export type LockResource = ResourceLockAction<SocketAction.LOCK_RESOURCE, LockAction.LOCK>;

export type UnlockResource = ResourceLockAction<SocketAction.UNLOCK_RESOURCE, LockAction.UNLOCK>;

export type UpdateResource = Action<SocketAction.UPDATE_RESOURCE, { resourceID: ResourceType; data: unknown }>;

export type AnySocketAction =
  | ReconnectNoop
  | LockNodes
  | UnlockNodes
  | AddNode
  | AddManyNodes
  | AddNestedNode
  | InsertNestedNode
  | UnmergeNode
  | RemoveManyNodes
  | UpdateNodeData
  | MoveNode
  | MoveManyNodes
  | AddOutDynamicPort
  | AddOutBuiltInPort
  | RemoveOutDynamicPort
  | RemoveOutBuiltInPort
  | ReorderOutDynamicPorts
  | MoveLink
  | AddLink
  | UpdateLinkData
  | UpdateLinkDataMany
  | RemoveLink
  | MoveMouse
  | LockResource
  | UnlockResource
  | UpdateResource;

// action creators

const createLockAction = <T extends SocketAction, P, M>(type: T, payload: P, meta?: M) => createAction(type, payload, { ...meta, lock: payload });

export const reconnectNoop = (): ReconnectNoop => createAction(SocketAction.RECONNECT_NOOP);

// locking nodes

export const lockNodes = (nodeIDs: string[], lockTypes: AnyNodeLock[]): LockNodes =>
  createLockAction(SocketAction.LOCK_NODES, { targets: nodeIDs, types: lockTypes, action: LockAction.LOCK });

export const unlockNodes = (nodeIDs: string[], lockTypes: AnyNodeLock[]): UnlockNodes =>
  createLockAction(SocketAction.UNLOCK_NODES, { targets: nodeIDs, types: lockTypes, action: LockAction.UNLOCK });

// nodes

export const addNode = (node: Creator.NodeDescriptor, data: Creator.DataDescriptor, parentNode: Creator.ParentNodeDescriptor): AddNode =>
  createAction(SocketAction.ADD_NODE, { node, data, parentNode });

export const addManyNodes = (entities: EntityMap, position: Point): AddManyNodes => createAction(SocketAction.ADD_MANY_NODES, { entities, position });

export const addNestedNode = (
  parentNodeID: string,
  node: Creator.NodeDescriptor,
  data: Creator.DataDescriptor,
  mergedNodeID: string
): AddNestedNode => createAction(SocketAction.ADD_NESTED_NODE, { parentNodeID, node, data, mergedNodeID });

export const insertNestedNode = (parentNodeID: string, index: number, nodeID: string): InsertNestedNode =>
  createAction(SocketAction.INSERT_NESTED_NODE, { parentNodeID, index, nodeID });

export const unmergeNode = (nodeID: string, position: Point, parentNode: Creator.ParentNodeDescriptor): UnmergeNode =>
  createAction(SocketAction.UNMERGE_NODE, { nodeID, position, parentNode });

export const removeManyNodes = (nodeIDs: string[]): RemoveManyNodes => createAction(SocketAction.REMOVE_MANY_NODES, nodeIDs);

export const updateNodeData = (nodeID: string, data: Partial<Realtime.NodeData<unknown>>): UpdateNodeData =>
  createAction(SocketAction.UPDATE_NODE_DATA, { nodeID, data });

export const moveNode = (nodeID: string, movement: Pair<number>, origin: Point): MoveNode =>
  createAction(SocketAction.MOVE_NODE, { nodeID, movement, origin });

export const moveManyNodes = (nodeIDs: string[], movement: Pair<number>, origins: Point[]): MoveManyNodes =>
  createAction(SocketAction.MOVE_MANY_NODES, { nodeIDs, movement, origins });

// ports

export const addOutDynamicPort = (nodeID: string, port: Realtime.PartialModel<Realtime.Port>): AddOutDynamicPort =>
  createAction(SocketAction.ADD_OUT_DYNAMIC_PORT, { nodeID, port });

export const addOutBuiltInPort = (nodeID: string, portType: BaseModels.PortType, port: Realtime.PartialModel<Realtime.Port>): AddOutBuiltInPort =>
  createAction(SocketAction.ADD_OUT_BUILT_IN_PORT, { nodeID, port, portType });

export const removeOutDynamicPort = (portID: string): RemoveOutDynamicPort => createAction(SocketAction.REMOVE_OUT_DYNAMIC_PORT, portID);

export const removeOutBuiltInPort = (portType: BaseModels.PortType, portID: string): RemoveOutBuiltInPort =>
  createAction(SocketAction.REMOVE_OUT_BUILT_IN_PORT, { portType, portID });

export const reorderOutDynamicPorts = (nodeID: string, from: number, to: number): ReorderOutDynamicPorts =>
  createAction(SocketAction.REORDER_OUT_DYNAMIC_PORTS, { nodeID, from, to });

// links

export const moveLink = (linkData: Either<{ reset: true }, { points: Pair<Point> }>): MoveLink => createAction(SocketAction.MOVE_LINK, linkData);

export const addLink = (sourcePortID: string, targetPortID: string, linkID: string): AddLink =>
  createAction(SocketAction.ADD_LINK, { sourcePortID, targetPortID, linkID });

export const updateLinkData = (linkID: string, data: Partial<Realtime.LinkData>): UpdateLinkData =>
  createAction(SocketAction.UPDATE_LINK_DATA, { data, linkID });

export const updateLinkDataMany = (payload: { linkID: string; data: Partial<Realtime.LinkData> }[]): UpdateLinkDataMany =>
  createAction(SocketAction.UPDATE_LINK_DATA_MANY, payload);

export const removeLink = (linkID: string): RemoveLink => createAction(SocketAction.REMOVE_LINK, linkID);

// mouse

export const moveMouse = (position: Point): MoveMouse => createAction(SocketAction.MOVE_MOUSE, position);

// resources

export const lockResource = (resourceID: ResourceType): LockResource =>
  createLockAction(SocketAction.LOCK_RESOURCE, { targets: [resourceID], types: [LockType.RESOURCE], action: LockAction.LOCK });

export const unlockResource = (resourceID: ResourceType): UnlockResource =>
  createLockAction(SocketAction.UNLOCK_RESOURCE, { targets: [resourceID], types: [LockType.RESOURCE], action: LockAction.UNLOCK });

export const updateResource = (resourceID: ResourceType, data: unknown): UpdateResource =>
  createAction(SocketAction.UPDATE_RESOURCE, { resourceID, data });
