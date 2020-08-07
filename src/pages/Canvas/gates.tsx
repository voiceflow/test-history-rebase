import React from 'react';

import { useCanvasRendered } from './hooks';

// eslint-disable-next-line import/prefer-default-export
export const CanvasRenderGate: React.FC = ({ children }) => {
  const isRendered = useCanvasRendered();

  if (!isRendered) return null;

  return <>{children}</>;
};
