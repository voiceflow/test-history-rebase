import React from 'react';

import { MarkupTransform } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';

import { HandlePosition } from '../../constants';

export interface OverlayState {
  ref: React.MutableRefObject<HTMLDivElement | null>;
  handlePosition: React.MutableRefObject<HandlePosition | null>;
  snapshot: React.MutableRefObject<MarkupTransform | null>;
  position: React.MutableRefObject<Point | null>;
  size: React.MutableRefObject<Pair<number> | null>;
  rotation: React.MutableRefObject<number | null>;
  isRotating: React.MutableRefObject<boolean>;
  zoom: React.MutableRefObject<number>;
}
