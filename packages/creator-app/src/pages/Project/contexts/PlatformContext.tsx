import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

export const PlatformContext = React.createContext<VoiceflowConstants.PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;

export const ProjectTypeContext = React.createContext<VoiceflowConstants.ProjectType | null>(null);
export const { Provider: ProjectTypeProvider, Consumer: ProjectTypeConsumer } = ProjectTypeContext;

export const ProjectProvider: React.FC<{
  platform: VoiceflowConstants.PlatformType | null;
  projectType: VoiceflowConstants.ProjectType | null;
}> = ({ projectType, platform, children }) => (
  <PlatformProvider value={platform}>
    <ProjectTypeProvider value={projectType}>{children}</ProjectTypeProvider>
  </PlatformProvider>
);
