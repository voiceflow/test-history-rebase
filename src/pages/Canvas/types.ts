import React from 'react';

import { MovementCalculator } from '@/components/Canvas/types';
import { LockOwner, NodeData } from '@/models';
import { Either, Pair, Point } from '@/types';

export type NodeDataUpdater<T> = (value: Partial<NodeData<T>>, save?: boolean) => void;

export type BlockAPI<T extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<T>;
  rename: () => void;
  getRect: () => DOMRect | null;
  addEventListener: <E extends keyof HTMLElementEventMap>(event: E, listener: (event: HTMLElementEventMap[E]) => void) => void;
  removeEventListener: <E extends keyof HTMLElementEventMap>(event: E, listener: (event: HTMLElementEventMap[E]) => void) => void;
};

export type StepAPI<T extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<T>;
  isDraggable: boolean;
  withPorts: boolean;
  lockOwner: LockOwner | null;
  wrapElement: (el: JSX.Element) => JSX.Element;
  handlers: {
    onClick: () => void;
    onDoubleClick: (event: React.MouseEvent) => void;
    onMouseUp: (event: React.MouseEvent) => void;
    onContextMenu: (event: React.MouseEvent) => void;
    onMouseEnter: (event: React.MouseEvent) => void;
    onMouseLeave: (event?: React.MouseEvent) => void;
    onDragStart: (event: React.DragEvent) => void;
  };
};

export type NewLinkAPI = {
  show: () => void;
  hide: () => void;
  isPinned: () => boolean;
  pin: (position: [number, number]) => void;
  unpin: () => void;
};

export type MergeLayerAPI<T extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<T>;
  isVisible: boolean;
  isTransparent: boolean;
  initialize: (point: [number, number], offset: [number, number]) => void;
  reset: () => void;
  setTransparent: () => void;
  clearTransparent: () => void;
};

export type RealtimeCursorOverlayAPI = {
  moveMouse: (tabID: string, location: Point) => void;
  zoomViewport: (calculateMovement: MovementCalculator) => void;
  panViewport: (movement: Pair<number>) => void;
  removeUser: (tabID: string) => void;
};

export type RealtimeLinkOverlayAPI = {
  moveLink: (tabID: string, linkData: Either<{ reset: true }, { points: Pair<Point> }>) => void;
  removeUser: (tabID: string) => void;
};

export type TransformOverlayAPI = {
  initialize: (rect: DOMRect) => void;
  translate: (movement: Pair<number>) => void;
  clearTransformations: () => void;
  reset: () => void;
};

export type NewShapeAPI = {
  show: (origin: Point) => void;
  hide: () => void;
};
