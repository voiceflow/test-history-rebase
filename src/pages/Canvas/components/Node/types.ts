import React from 'react';

import { NodeInstance } from '@/pages/Canvas/engine/entities/nodeEntity';
import { BlockAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';

export type InternalNodeInstance<T extends HTMLElement> = NodeInstance & {
  ref: React.RefObject<T>;
  blockRef: React.RefObject<BlockAPI>;
  position: React.RefObject<Point>;
  getPosition: () => Point;
};
