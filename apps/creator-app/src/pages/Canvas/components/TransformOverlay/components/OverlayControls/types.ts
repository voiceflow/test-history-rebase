import React from 'react';

import { MarkupTransform } from '@/pages/Canvas/types';

export interface OverlayState {
  overlayRect: React.MutableRefObject<DOMRect | null>;
  snapshot: React.MutableRefObject<MarkupTransform | null>;
  rotation: React.MutableRefObject<number | null>;
}
