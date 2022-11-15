import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import * as NLU from '@/config/nlu';

export const NLUTypeContext = React.createContext<Platform.Constants.NLUType | null>(null);
export const { Provider: NLUTypeProvider, Consumer: NLUTypeConsumer } = NLUTypeContext;

export const NLUTypeConfigContext = React.createContext<NLU.Base.Config>(NLU.Base.CONFIG);
export const { Provider: NLUTypeConfigProvider, Consumer: NLUTypeConfigConsumer } = NLUTypeConfigContext;

export const PlatformContext = React.createContext<Platform.Constants.PlatformType | null>(null);
export const { Provider: PlatformProvider, Consumer: PlatformConsumer } = PlatformContext;

export const PlatformConfigContext = React.createContext<Platform.Base.Config>(Platform.Base.CONFIG);
export const { Provider: PlatformConfigProvider, Consumer: PlatformConfigConsumer } = PlatformConfigContext;

export const ProjectTypeContext = React.createContext<Platform.Constants.ProjectType | null>(null);
export const { Provider: ProjectTypeProvider, Consumer: ProjectTypeConsumer } = ProjectTypeContext;

export const ProjectTypeConfigContext = React.createContext<Platform.Base.Type.Config>(Platform.Base.Type.CONFIG);
export const { Provider: ProjectTypeConfigProvider, Consumer: ProjectTypeConfigConsumer } = ProjectTypeConfigContext;

export const ProjectProvider: React.FC<{
  nluType: Platform.Constants.NLUType | null;
  platform: Platform.Constants.PlatformType | null;
  projectType: Platform.Constants.ProjectType | null;
}> = ({ nluType, platform, children, projectType }) => {
  const [nluConfig, platformConfig, platformTypeConfig] = React.useMemo(
    () => [NLU.Config.get(nluType), Platform.Config.get(platform), Platform.Config.getTypeConfig({ type: projectType, platform })] as const,
    [nluType, platform, projectType]
  );

  return (
    <PlatformProvider value={platform}>
      <PlatformConfigProvider value={platformConfig}>
        <ProjectTypeProvider value={projectType}>
          <ProjectTypeConfigProvider value={platformTypeConfig}>
            <NLUTypeProvider value={nluType}>
              <NLUTypeConfigProvider value={nluConfig}>{children}</NLUTypeConfigProvider>
            </NLUTypeProvider>
          </ProjectTypeConfigProvider>
        </ProjectTypeProvider>
      </PlatformConfigProvider>
    </PlatformProvider>
  );
};
