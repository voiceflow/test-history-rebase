import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import type { NLPTrainJob } from '@/models';
import type { StageComponentProps } from '@/platforms/types';

export interface PublishedStageProps extends StageComponentProps<NLPTrainJob.SuccessStage> {
  onClick: VoidFunction;
}

export const PublishedStage: React.FC<PublishedStageProps> = ({ onClick }) => (
  <UploadedStage description="A new version of your agent has been published to Teams">
    <Button squareRadius fullWidth variant={ButtonVariant.QUATERNARY} onClick={onClick}>
      See Documentation
    </Button>
  </UploadedStage>
);
