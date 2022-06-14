import React from 'react';

import { NodeInstance } from '@/pages/Canvas/engine/entities/nodeEntity';
import { BlockAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';

export interface InternalNodeInstance<T extends HTMLElement> extends NodeInstance {
  ref: React.RefObject<T>;
  blockRef: React.RefObject<BlockAPI>;
  position: React.RefObject<Point>;
}
