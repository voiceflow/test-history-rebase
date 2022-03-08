import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

export const PlatformContext = React.createContext<VoiceflowConstants.PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;

export const PlatformV2Context = React.createContext<VoiceflowConstants.PlatformType | null>(null);
export const { Provider: PlatformV2Provider, Consumer: PlatformV2Consumer } = PlatformV2Context;

export const TypeV2Context = React.createContext<VoiceflowConstants.ProjectType | null>(null);
export const { Provider: TypeV2Provider, Consumer: TypeV2Consumer } = TypeV2Context;

export const ProjectProvider: React.FC<{
  platform: VoiceflowConstants.PlatformType | null;

  typeV2: VoiceflowConstants.ProjectType | null;
  platformV2: VoiceflowConstants.PlatformType | null;
}> = ({ typeV2, platform, platformV2, children }) => (
  <PlatformProvider value={platform}>
    <PlatformV2Provider value={platformV2}>
      <TypeV2Provider value={typeV2}>{children}</TypeV2Provider>
    </PlatformV2Provider>
  </PlatformProvider>
);
