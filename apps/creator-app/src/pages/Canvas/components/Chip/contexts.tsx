import React from 'react';

import { ChipAPI } from '@/pages/Canvas/types';

export const ChipAPIContext = React.createContext<ChipAPI<HTMLElement> | null>(null);
export const { Consumer: ChipAPIConsumer, Provider: ChipAPIProvider } = ChipAPIContext;
