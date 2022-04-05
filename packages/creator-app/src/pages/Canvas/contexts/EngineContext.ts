import { withContext } from '@voiceflow/ui';
import React from 'react';

import type Engine from '@/pages/Canvas/engine';

export const EngineContext = React.createContext<Engine | null>(null);
export const { Provider: EngineProvider, Consumer: EngineConsumer } = EngineContext;

export const withEngine = withContext(EngineContext, 'engine');

export interface InjectedEngineProps {
  engine: Engine;
}
