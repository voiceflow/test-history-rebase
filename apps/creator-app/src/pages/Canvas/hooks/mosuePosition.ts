import { useMouseMove } from '@voiceflow/ui';
import React from 'react';

import { Point } from '@/types';

export const useMousePosition = () => {
  const mousePositionContext = React.useRef<Point>([0, 0]);

  useMouseMove(({ clientX, clientY }) => {
    mousePositionContext.current = [clientX, clientY];
  });

  return mousePositionContext;
};
