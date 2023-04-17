import React from 'react';

import {
  ProjectNLUTypeConfigContext,
  ProjectNLUTypeContext,
  ProjectPlatformConfigContext,
  ProjectPlatformContext,
  ProjectTypeConfigContext,
  ProjectTypeContext,
} from '@/contexts/ProjectConfigProvider';

export const useActiveProjectNLU = () => React.useContext(ProjectNLUTypeContext);
export const useActiveProjectNLUConfig = () => React.useContext(ProjectNLUTypeConfigContext);

export const useActiveProjectPlatform = () => React.useContext(ProjectPlatformContext);
export const useActiveProjectPlatformConfig = () => React.useContext(ProjectPlatformConfigContext);

export const useActiveProjectType = () => React.useContext(ProjectTypeContext);
export const useActiveProjectTypeConfig = () => React.useContext(ProjectTypeConfigContext);

export const useActiveProjectConfig = () => {
  const nluConfig = useActiveProjectNLUConfig();
  const platformConfig = useActiveProjectPlatformConfig();
  const projectTypeConfig = useActiveProjectTypeConfig();

  return {
    nlu: nluConfig.type,
    platform: platformConfig.type,
    nluConfig,
    projectType: projectTypeConfig.type,
    platformConfig,
    projectTypeConfig,
  };
};
