import React from 'react';

import { useCanvasRendered } from './hooks';

export const CanvasRenderGate: React.OldFC = ({ children }) => {
  const isRendered = useCanvasRendered();

  if (!isRendered) return null;

  return <>{children}</>;
};
