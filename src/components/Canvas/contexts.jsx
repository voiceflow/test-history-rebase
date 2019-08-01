import React from 'react';

import { withContext } from '@/hocs';

export const CanvasContext = React.createContext(null);
export const { Provider: CanvasProvider, Consumer: CanvasConsumer } = CanvasContext;

export const withCanvas = withContext(CanvasContext, 'canvas');
