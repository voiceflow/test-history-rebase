import React from 'react';

import { LockOwnerType } from '@/models';

export type PortAPI = {
  instanceID: string;
  getRect: () => DOMRect;
  isHighlighted?: boolean;
  setHighlight?: () => void;
  clearHighlight?: () => void;
};

export type NodeAPI<T extends HTMLElement = HTMLElement> = {
  instanceID: string;
  getPosition: () => [number, number];
  rename: () => void;
  ref?: React.RefObject<T>;
  isDragging?: boolean;
  isHighlighted?: boolean;
  setHighlight?: () => void;
  clearHighlight?: () => void;
};

export type BlockNodeAPI = NodeAPI & {
  instanceID: string;
  getPosition: () => [number, number];
  rename: () => void;
  setMergeCandidate: () => void;
  clearMergeCandidate: () => void;
  setMergeTarget: () => void;
  clearMergeTarget: () => void;
};

export type StepAPI<T extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<T>;
  isActive: boolean;
  isHovered: boolean;
  isDraggable: boolean;
  hasLinkWarning: boolean;
  withPorts: boolean;
  lockOwner: LockOwnerType;
  wrapElement: (el: JSX.Element) => JSX.Element;
  handlers: {
    onClick: () => void;
    onDoubleClick: () => void;
    onMouseUp: (event: React.MouseEvent) => void;
    onContextMenu: (event: React.MouseEvent) => void;
    onMouseEnter: (event: React.MouseEvent) => void;
    onMouseLeave: (event: React.MouseEvent) => void;
    onDragStart: (event: React.DragEvent) => void;
  };
};

export type MergeLayerAPI<T extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<T>;
  isVisible: boolean;
  initialize: (point: [number, number], offset: [number, number]) => void;
  reset: () => void;
};
