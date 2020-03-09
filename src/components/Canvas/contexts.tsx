import React from 'react';

import { withContext } from '@/hocs';

import { CanvasAPI } from './types';

export const CanvasContext = React.createContext<CanvasAPI | null>(null);
export const { Provider: CanvasProvider, Consumer: CanvasConsumer } = CanvasContext;

export const withCanvas = withContext(CanvasContext, 'canvas');
