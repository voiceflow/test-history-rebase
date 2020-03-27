import React from 'react';

import { LockOwnerType } from '@/models';

export type PortAPI = {
  getRect: () => DOMRect;
  // isHighlighted?: () => boolean;
  setHighlight?: () => void;
  clearHighlight?: () => void;
};

export type NodeAPI = {
  getPosition: () => [number, number];
  rename: () => void;
  setHighlight?: () => void;
  clearHighlight?: () => void;
};

export type StepAPI<T extends HTMLElement = HTMLElement> = {
  ref: React.RefObject<T>;
  isActive: boolean;
  isHovered: boolean;
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
  };
};
