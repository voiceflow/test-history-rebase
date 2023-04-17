import React from 'react';

import { NodeInstance } from '@/pages/Canvas/engine/entities/nodeEntity';
import { CombinedAPI } from '@/pages/Canvas/types';
import { Point } from '@/types';

export interface InternalNodeInstance<T extends HTMLElement> extends NodeInstance {
  ref: React.RefObject<T>;
  nodeRef: React.RefObject<CombinedAPI>;
  position: React.RefObject<Point>;
}
