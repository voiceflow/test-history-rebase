import React from 'react';

import type Engine from '@/pages/Canvas/engine';

export const EngineContext = React.createContext<Engine | null>(null);
export const { Provider: EngineProvider } = EngineContext;
