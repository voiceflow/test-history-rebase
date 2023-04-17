import React from 'react';

import { useCanvasRendered } from './hooks';

export const CanvasRenderGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isRendered = useCanvasRendered();

  if (!isRendered) return null;

  return <>{children}</>;
};
