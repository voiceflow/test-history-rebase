import React from 'react';

import { NLUTypeConfigContext, PlatformConfigContext, ProjectTypeConfigContext } from '@/pages/Project/contexts';

export const useActiveNLUConfig = () => React.useContext(NLUTypeConfigContext);

export const useActivePlatformConfig = () => React.useContext(PlatformConfigContext);

export const useActiveProjectTypeConfig = () => React.useContext(ProjectTypeConfigContext);
