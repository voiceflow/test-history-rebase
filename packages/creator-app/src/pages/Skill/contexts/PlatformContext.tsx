import React from 'react';

import { PlatformType } from '@/constants';

export const PlatformContext = React.createContext<PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;
