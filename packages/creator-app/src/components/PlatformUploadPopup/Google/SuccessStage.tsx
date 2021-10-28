import React from 'react';

import { GoogleExportJobSuccessType, GooglePublishJobSuccessType } from '@/constants/platforms';
import { GoogleExportJob, GooglePublishJob, JobStageData } from '@/models';

import { DownloadStage, SubmittedStage, UploadedStage } from '../components';
import { GOOGLE_CONSOLE_PROJECT_URL, GOOGLE_CONSOLE_URL } from './constants';

interface SuccessStageProps {
  stage: GoogleExportJob.SuccessStage | GooglePublishJob.SuccessStage;
  cancel: () => void;
}

const SuccessStage: React.FC<SuccessStageProps> = ({ stage, cancel }) => {
  const { googleProjectID } = stage.data as JobStageData<GooglePublishJob.SuccessStage>;

  switch (stage.data.successType) {
    case GooglePublishJobSuccessType.SUBMIT:
      return <SubmittedStage />;
    case GooglePublishJobSuccessType.UPLOAD:
      return (
        <UploadedStage
          buttonText="Test on Google"
          description="Your Action is now ready for use on the Google Actions Console"
          learnMoreUrl={GOOGLE_CONSOLE_URL}
          redirectUrl={GOOGLE_CONSOLE_PROJECT_URL(googleProjectID)}
        />
      );
    case GoogleExportJobSuccessType.DOWNLOAD:
      return <DownloadStage cancel={cancel} stageData={stage.data} />;
    default:
      return null;
  }
};

export default SuccessStage;
