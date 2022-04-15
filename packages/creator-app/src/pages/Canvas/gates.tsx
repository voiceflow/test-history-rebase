import React from 'react';

import { useCanvasRendered } from './hooks';

export const CanvasRenderGate: React.FC = ({ children }) => {
  const isRendered = useCanvasRendered();

  if (!isRendered) return null;

  return <>{children}</>;
};
