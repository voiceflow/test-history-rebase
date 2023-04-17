import { useMouseMove } from '@voiceflow/ui';
import React from 'react';

import { Point } from '@/types';

export const MousePositionContext = React.createContext<React.MutableRefObject<Point>>({ current: [0, 0] as Point });
export const { Consumer: MousePositionConsumer } = MousePositionContext;

export const MousePositionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const mousePositionContext = React.useRef<Point>([0, 0]);

  useMouseMove(({ clientX, clientY }) => {
    mousePositionContext.current = [clientX, clientY];
  });

  return <MousePositionContext.Provider value={mousePositionContext}>{children}</MousePositionContext.Provider>;
};
