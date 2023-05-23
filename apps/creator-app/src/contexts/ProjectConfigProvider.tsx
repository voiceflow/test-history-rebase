import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import * as NLU from '@/config/nlu';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeatures } from '@/hooks/feature';
import { useSelector } from '@/hooks/redux';

export const ProjectNLUTypeContext = React.createContext<Platform.Constants.NLUType>(NLU.Base.CONFIG.type);
export const { Provider: ProjectNLUTypeProvider, Consumer: ProjectNLUTypeConsumer } = ProjectNLUTypeContext;

export const ProjectNLUTypeConfigContext = React.createContext<NLU.Base.Config>(NLU.Base.CONFIG);
export const { Provider: ProjectNLUTypeConfigProvider, Consumer: ProjectNLUTypeConfigConsumer } = ProjectNLUTypeConfigContext;

export const ProjectPlatformContext = React.createContext<Platform.Constants.PlatformType>(Platform.Base.CONFIG.type);
export const { Provider: ProjectPlatformProvider, Consumer: ProjectPlatformConsumer } = ProjectPlatformContext;

export const ProjectPlatformConfigContext = React.createContext<Platform.Base.Config>(Platform.Base.CONFIG);
export const { Provider: ProjectPlatformConfigProvider, Consumer: ProjectPlatformConfigConsumer } = ProjectPlatformConfigContext;

export const ProjectTypeContext = React.createContext<Platform.Constants.ProjectType>(Platform.Base.Type.CONFIG.type);
export const { Provider: ProjectTypeProvider, Consumer: ProjectTypeConsumer } = ProjectTypeContext;

export const ProjectTypeConfigContext = React.createContext<Platform.Base.Type.Config>(Platform.Base.Type.CONFIG);
export const { Provider: ProjectTypeConfigProvider, Consumer: ProjectTypeConfigConsumer } = ProjectTypeConfigContext;

export const ProjectConfigProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const nluType = useSelector(ProjectV2.active.nluTypeSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);
  const { enabledFeatures } = useFeatures();

  const [nluConfig, platformConfig, platformTypeConfig] = React.useMemo(
    () =>
      [
        NLU.Config.get(nluType),
        Platform.Config.get(platform),
        Platform.Config.getTypeConfig({ type: projectType, platform, features: enabledFeatures }),
      ] as const,
    [nluType, platform, projectType]
  );

  return (
    <ProjectPlatformProvider value={platform}>
      <ProjectPlatformConfigProvider value={platformConfig}>
        <ProjectTypeProvider value={projectType}>
          <ProjectTypeConfigProvider value={platformTypeConfig}>
            <ProjectNLUTypeProvider value={nluType}>
              <ProjectNLUTypeConfigProvider value={nluConfig}>{children}</ProjectNLUTypeConfigProvider>
            </ProjectNLUTypeProvider>
          </ProjectTypeConfigProvider>
        </ProjectTypeProvider>
      </ProjectPlatformConfigProvider>
    </ProjectPlatformProvider>
  );
};
