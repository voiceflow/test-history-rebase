import React from 'react';

import { BlockVariant } from '@/constants/canvas';
import { LockOwnerType } from '@/models';
import { Pair, Point } from '@/types';

import { MergeStatus } from './constants';

export type EntityAPI = {
  instanceID: string;
};

export type PortAPI = EntityAPI & {
  isReady: () => boolean;
  getRect: () => DOMRect;
  isHighlighted?: boolean;
  setHighlight?: () => void;
  clearHighlight?: () => void;
};

export type LinkAPI = EntityAPI & {
  translatePoint: (point: Point, isSource: boolean) => void;
};

export type NodeAPI<T extends HTMLElement = HTMLElement> = EntityAPI & {
  getPosition: () => [number, number];
  rename: () => void;
  ref?: React.RefObject<T>;
  isDragging?: boolean;
  isHighlighted?: boolean;
  setHighlight?: () => void;
  clearHighlight?: () => void;
};

export type BlockNodeAPI = {
  setMergeStatus: (status: MergeStatus) => void;
  setMergeTarget: () => void;
  clearMergeTarget: () => void;
  translate: (movement: Pair<number>) => void;
  drag: () => void;
  drop: () => void;
  forceDrag: () => void;
  updateBlockColor: (color: BlockVariant) => void;
  getRect: () => DOMRect;
  getBlockRect: () => DOMRect;
};

export type AnyNodeAPI = NodeAPI & Partial<BlockNodeAPI>;

export type StepAPI<T extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<T>;
  isActive: boolean;
  isHovered: boolean;
  isDraggable: boolean;
  hasLinkWarning: boolean;
  withPorts: boolean;
  setHovering: (hovering: boolean) => void;
  lockOwner: LockOwnerType | null;
  wrapElement: (el: JSX.Element) => JSX.Element;
  handlers: {
    onClick: () => void;
    onDoubleClick: () => void;
    onMouseUp: (event: React.MouseEvent) => void;
    onContextMenu: (event: React.MouseEvent) => void;
    onMouseEnter: (event: React.MouseEvent) => void;
    onMouseLeave: (event?: React.MouseEvent) => void;
    onDragStart: (event: React.DragEvent) => void;
  };
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
  zoomViewport: (calculateMovement: (mouseLocation: Point) => Pair<number>) => void;
  panViewport: (moveX: number, moveY: number) => void;
  removeUser: (tabID: string) => void;
};

export type RealtimeLinkOverlayAPI = {
  moveLink: (tabID: string, linkData: { reset: true; points: never } | { reset: never; points: Pair<Point> }) => void;
  removeUser: (tabID: string) => void;
};
