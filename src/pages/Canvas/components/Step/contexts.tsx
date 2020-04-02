import React from 'react';

import { StepAPI } from '@/pages/Canvas/types';

export const StepAPIContext = React.createContext<StepAPI<any> | null>(null);
export const { Consumer: StepAPIConsumer, Provider: StepAPIProvider } = StepAPIContext;
