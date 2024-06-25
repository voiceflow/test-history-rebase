import type React from 'react';

import type { NodeInstance } from '@/pages/Canvas/engine/entities/nodeEntity';
import type { CombinedAPI } from '@/pages/Canvas/types';
import type { Point } from '@/types';

export interface InternalNodeInstance<T extends HTMLElement> extends NodeInstance {
  ref: React.RefObject<T>;
  nodeRef: React.RefObject<CombinedAPI>;
  position: React.RefObject<Point>;
}
