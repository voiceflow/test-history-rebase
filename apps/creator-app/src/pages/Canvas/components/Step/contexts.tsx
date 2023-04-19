import React from 'react';

import type { ActionStepAPI, StepAPI } from '@/pages/Canvas/types';

export const StepAPIContext = React.createContext<StepAPI<any> | null>(null);
export const { Consumer: StepAPIConsumer, Provider: StepAPIProvider } = StepAPIContext;

export const ActionsPortAPIContext = React.createContext<ActionStepAPI | null>(null);
export const { Consumer: ActionsPortAPIConsumer, Provider: ActionsPortAPIProvider } = ActionsPortAPIContext;
