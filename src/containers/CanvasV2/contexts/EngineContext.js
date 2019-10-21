import React from 'react';

import { withContext } from '@/hocs';

export const EngineContext = React.createContext(null);
export const { Provider: EngineProvider, Consumer: EngineConsumer } = EngineContext;

export const withEngine = withContext(EngineContext, 'engine');
