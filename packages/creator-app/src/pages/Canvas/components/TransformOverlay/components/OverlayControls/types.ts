import React from 'react';

import { MarkupTransform } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';

import { HandlePosition } from '../../constants';

export interface OverlayState {
  ref: React.MutableRefObject<HTMLDivElement | null>;
  size: React.MutableRefObject<Pair<number> | null>;
  snapshot: React.MutableRefObject<MarkupTransform | null>;
  position: React.MutableRefObject<Point | null>;
  rotation: React.MutableRefObject<number | null>;
  isRotating: React.MutableRefObject<boolean>;
  handlePosition: React.MutableRefObject<HandlePosition | null>;
}
