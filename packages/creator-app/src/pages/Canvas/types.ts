import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { LockOwner } from '@/models';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';

import { RealtimeCursorEvents } from './components/RealtimeOverlay/contexts';

export interface MarkupTransform {
  scale: number;
  width: number;
  height: number;
  rotate: number;
  invertX: boolean;
  invertY: boolean;
  origin: Coords;
}

export interface EntityPrompt {
  id: string;
  name: string;
  content: string;
  color: string;
}

export type NodeDataUpdater<T> = (value: Partial<Realtime.NodeData<T>>, save?: boolean) => Promise<void>;

export interface CanvasContainerAPI {
  addClass: (className: string) => void;
  removeClass: (className: string) => void;
}

export interface BlockAPI<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  rename: () => void;
  getRect: () => DOMRect | null;
  addEventListener: <E extends keyof HTMLElementEventMap>(event: E, listener: (event: HTMLElementEventMap[E]) => void) => void;
  removeEventListener: <E extends keyof HTMLElementEventMap>(event: E, listener: (event: HTMLElementEventMap[E]) => void) => void;
}

export interface StepAPI<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  isDraggable: boolean;
  withPorts: boolean;
  lockOwner: LockOwner | null;
  wrapElement: (el: JSX.Element) => JSX.Element;
  handlers: {
    onClick: (event: React.MouseEvent) => void;
    onDoubleClick: (event: React.MouseEvent) => void;
    onMouseUp: (event: React.MouseEvent) => void;
    onContextMenu: (event: React.MouseEvent) => void;
    onMouseEnter: (event: React.MouseEvent) => void;
    onMouseLeave: (event?: React.MouseEvent) => void;
    onDragStart: (event: React.DragEvent) => void;
  };
}

export interface NewLinkAPI {
  show: (rect: DOMRect) => void;
  hide: () => void;
  isPinned: () => boolean;
  pin: (rect: DOMRect) => void;
  unpin: () => void;
}

export interface CommentDraftValue {
  text: string;
  mentions: number[];
}

export interface CommentAPI {
  getDraft: () => CommentDraftValue | null;
  setDraft: (draft: CommentDraftValue) => void;
}

export interface NewCommentAPI extends CommentAPI {
  show: (origin: Coords) => void;
  hide: () => void;
  getOrigin: () => Coords | null;
}

export interface MergeLayerAPI<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  isVisible: boolean;
  isTransparent: boolean;

  reset: () => void;
  initialize: (point: Point, offset: Pair<number>) => void;
  setTransparent: () => void;
  handleMouseMove: (event: MouseEvent) => void;
  clearTransparent: () => void;
}

export interface RealtimeCursorOverlayAPI extends RealtimeCursorEvents {
  moveMouse: (tabID: string, location: Point) => void;
  removeUser: (tabID: string) => void;
}

export interface TransformOverlayAPI {
  initialize: (transform: MarkupTransform) => void;
  translate: (movement: Pair<number>) => void;
  resize: (height: number) => void;
  clearTransformations: () => void;
  reset: () => void;
}

export interface SelectionMarqueeAPI {
  show: () => void;
}
