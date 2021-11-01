import { Constants } from '@voiceflow/general-types';
import React from 'react';

export const PlatformContext = React.createContext<Constants.PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;
