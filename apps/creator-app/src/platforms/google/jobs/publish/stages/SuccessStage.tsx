import React from 'react';

import { UploadedStage } from '@/components/PlatformUploadPopup/components';
import { GooglePublishJob, JobStageData } from '@/models';
import { GOOGLE_CONSOLE_PROJECT_URL, GOOGLE_CONSOLE_URL } from '@/platforms/google/constants';
import { StageComponentProps } from '@/platforms/types';

const SuccessStage: React.FC<StageComponentProps<GooglePublishJob.SuccessStage>> = ({ stage }) => {
  const { googleProjectID } = stage.data as JobStageData<GooglePublishJob.SuccessStage>;

  return (
    <UploadedStage
      buttonText="Test on Google"
      description="Your Action is now ready for use on the Google Actions Console"
      learnMoreUrl={GOOGLE_CONSOLE_URL}
      redirectUrl={GOOGLE_CONSOLE_PROJECT_URL(googleProjectID)}
    />
  );
};

export default SuccessStage;
