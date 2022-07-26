import React from 'react';

import type { StepAPI } from '@/pages/Canvas/types';
import type { PathPoints } from '@/types';

export const StepAPIContext = React.createContext<StepAPI<any> | null>(null);
export const { Consumer: StepAPIConsumer, Provider: StepAPIProvider } = StepAPIContext;

export const ActionsPortAPIContext = React.createContext<{ updatePosition: (points: PathPoints | null) => void } | null>(null);
export const { Consumer: ActionsPortAPIConsumer, Provider: ActionsPortAPIProvider } = ActionsPortAPIContext;
