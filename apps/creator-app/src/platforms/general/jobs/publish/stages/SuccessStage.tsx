import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import * as Router from '@/ducks/router';
import { useSyncProjectLiveVersion } from '@/hooks/project';
import { useDispatch } from '@/hooks/realtime';
import { NLPTrainJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';

const SuccessStage: React.FC<StageComponentProps<NLPTrainJob.SuccessStage>> = () => {
  useSyncProjectLiveVersion();
  const goToDialogManagerAPI = useDispatch(Router.goToActiveDialogManagerAPI);

  const onApiButtonClick = () => {
    goToDialogManagerAPI();
  };

  return (
    <UploadedStage description="A new version of your assistant has been successfully published">
      <Button squareRadius fullWidth variant={ButtonVariant.QUATERNARY} onClick={onApiButtonClick}>
        Dialog Manager API
      </Button>
    </UploadedStage>
  );
};

export default SuccessStage;
