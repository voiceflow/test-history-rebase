import type { Pair, Point } from '@realtime-sdk/types';

export enum Event {
  CURSOR_MOVE = 'cursor-move',
  DIAGRAM_JOIN = 'diagram-join',
  DIAGRAM_LEAVE = 'diagram-leave',
  NODE_DRAG_MANY = 'node-drag-many',
  THREAD_DRAG_MANY = 'thread-drag-many',
}

export enum ChannelName {
  DIAGRAM = 'diagram',
}

export interface BaseBroadcastData {
  creatorID: number;
}

export interface DiagramChannelData {
  versionID: string;
  diagramID: string;
}

export interface CursorMoveUserData extends DiagramChannelData {
  coords: Point;
}

export interface CursorMoveBroadcastData extends BaseBroadcastData, CursorMoveUserData {}

export interface NodeDragManyUserData extends DiagramChannelData {
  nodeIDs: string[];
  origins: Point[];
  movement: Pair<number>;
}

export interface ThreadDragManyUserData extends DiagramChannelData {
  origins: Point[];
  movement: Pair<number>;
  threadIDs: string[];
}

export interface NodeDragManyBroadcastData extends BaseBroadcastData, NodeDragManyUserData {}

export interface ThreadDragManyBroadcastData extends BaseBroadcastData, ThreadDragManyUserData {}

const createChannelCreator =
  (channelName: ChannelName) =>
  (id: string): string =>
    `${channelName}:${id}`;

export const diagramChannel = createChannelCreator(ChannelName.DIAGRAM);
