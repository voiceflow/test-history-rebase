import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

export const PlatformContext = React.createContext<VoiceflowConstants.PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;
