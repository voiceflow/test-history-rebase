import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { LockOwner } from '@/models';
import { Pair, Point } from '@/types';
import { Coords } from '@/utils/geometry';

import { RealtimeCursorEvents } from './components/RealtimeOverlay/contexts';

export interface MarkupTransform {
  rect: DOMRect;
  rotate: number;
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
    onClick: React.MouseEventHandler<T>;
    onMouseUp: React.MouseEventHandler<T>;
    onDragStart: React.DragEventHandler<T>;
    onMouseEnter: React.MouseEventHandler<T>;
    onMouseLeave: React.MouseEventHandler<T>;
    onDoubleClick: React.MouseEventHandler<T>;
    onContextMenu: React.MouseEventHandler<T>;
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
  reset: () => void;
  sync: (transform: MarkupTransform) => void;
  initialize: (transform: MarkupTransform) => void;
  clearTransformations: () => void;
}

export interface SelectionMarqueeAPI {
  show: () => void;
}
