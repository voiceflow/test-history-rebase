import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { LockOwner } from '@/models';
import type { ChipApiRef } from '@/pages/Canvas/components/Chip';
import type { PathPoints } from '@/types';
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
  color: string;
  content: string;
}

export type NodeDataUpdater<T> = (value: Partial<Realtime.NodeData<T>>) => Promise<void>;

export interface CanvasContainerAPI {
  addClass: (className: string) => void;
  removeClass: (className: string) => void;
}

export interface CombinedAPI<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  rename: VoidFunction;
  getRect: () => DOMRect | null;
  addEventListener: <E extends keyof HTMLElementEventMap>(event: E, listener: (event: HTMLElementEventMap[E]) => void) => void;
  removeEventListener: <E extends keyof HTMLElementEventMap>(event: E, listener: (event: HTMLElementEventMap[E]) => void) => void;
}

export interface ActionStepAPI {
  parentPath?: string;
  parentParams?: Record<string, string>;
  updatePosition: (points: PathPoints | null) => void;
}

export interface StepAPI<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  withPorts: boolean;
  lockOwner: LockOwner | null;
  isDraggable: boolean;
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

export interface ChipAPI<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  name: string;
  nodeID: string;
  apiRef: React.RefObject<ChipApiRef>;
  palette: HSLShades;
  withPort: boolean;
  onRename: (name: string) => void;
  lockOwner: LockOwner | null;
  isDisabled?: boolean;

  handlers: {
    onClick?: React.MouseEventHandler<T>;
    onMouseMove?: React.MouseEventHandler<HTMLElement>;
    onMouseDown?: React.MouseEventHandler<HTMLElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  };
}

export interface NewLinkAPI {
  show: (rect: DOMRect) => void;
  hide: () => void;
  isPinned: () => boolean;
  pin: (rect: DOMRect) => void;
  unpin: () => void;
  hideMenu: () => void;
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
