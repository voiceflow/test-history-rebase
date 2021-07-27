import { PlatformType } from '@voiceflow/internal';
import React from 'react';

export const PlatformContext = React.createContext<PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;
