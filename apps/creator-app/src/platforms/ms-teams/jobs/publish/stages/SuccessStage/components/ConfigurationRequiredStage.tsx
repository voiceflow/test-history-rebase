import React from 'react';

import { StageConfigurationRequired } from '@/components/PlatformUploadPopup/components';
import type { NLPTrainJob } from '@/models';
import type { StageComponentProps } from '@/platforms/types';

export interface ConfigurationRequiredStageProps extends StageComponentProps<NLPTrainJob.SuccessStage> {
  onClick: VoidFunction;
}

export const ConfigurationRequiredStage: React.FC<ConfigurationRequiredStageProps> = ({ onClick }) => (
  <StageConfigurationRequired
    platformName="Microsoft Teams"
    description="Connect your agent to your Microsoft Teams account."
    buttonText="Connect to Microsoft Teams"
    redirectCallback={onClick}
  />
);
