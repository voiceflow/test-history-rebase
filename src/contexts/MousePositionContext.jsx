import React from 'react';

import { useMouseMove } from '@/hooks/mouse';

export const MousePositionContext = React.createContext(null);
export const { Consumer: MousePositionConsumer } = MousePositionContext;

export const MousePositionProvider = ({ children }) => {
  const mousePositionContext = React.useRef();

  useMouseMove(({ clientX, clientY }) => {
    mousePositionContext.current = [clientX, clientY];
  });

  return <MousePositionContext.Provider value={mousePositionContext}>{children}</MousePositionContext.Provider>;
};
