import React from 'react';

import { withContext } from '@/hocs';
import type { Engine } from '@/pages/Canvas/engine';

export const EngineContext = React.createContext<Engine | null>(null);
export const { Provider: EngineProvider, Consumer: EngineConsumer } = EngineContext;

export const withEngine = withContext(EngineContext, 'engine');

export type InjectedEngineProps = {
  engine: Engine;
};
