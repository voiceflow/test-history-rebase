import * as Realtime from '@voiceflow/realtime-sdk';
import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import * as Router from '@/ducks/router';
import { useFeature } from '@/hooks/feature';
import { useSyncProjectLiveVersion } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const SuccessStage: React.FC<StageComponentProps<NLPTrainJob.SuccessStage>> = () => {
  useSyncProjectLiveVersion();
  const { isEnabled: isProjectApiImprovementsEnabled } = useFeature(Realtime.FeatureFlag.PROJECT_API_IMPROVEMENTS);
  const goToPublishProjectAPI = useDispatch(Router.goToActiveProjectAPIPublish);

  const goToConsole = useDispatch(Router.goToActivePlatformPublish);

  const onApiButtonClick = () => {
    if (isProjectApiImprovementsEnabled) {
      goToPublishProjectAPI();
      return;
    }

    goToConsole();
  };

  return (
    <UploadedStage description="A new version of your assistant has been successfully published">
      <Button squareRadius fullWidth variant={ButtonVariant.QUATERNARY} onClick={onApiButtonClick}>
        {isProjectApiImprovementsEnabled ? 'Project API' : 'Dialog API'}
      </Button>
    </UploadedStage>
  );
};

export default SuccessStage;
