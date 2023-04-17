import { withContext } from '@voiceflow/ui';
import React from 'react';

import type { CanvasAPI } from './index';

export const CanvasContext = React.createContext<CanvasAPI | null>(null);
export const { Provider: CanvasProvider, Consumer: CanvasConsumer } = CanvasContext;

export const withCanvas = withContext(CanvasContext, 'canvas');
