import React from 'react';

import { GoogleExportJobSuccessType, GooglePublishJobSuccessType } from '@/constants/platforms';
import { GoogleExportJob, GooglePublishJob } from '@/models';

import { DownloadStage } from '../components';
import { Submitted, Uploaded } from './components';

interface SuccessStageProps {
  stage: GoogleExportJob.SuccessStage | GooglePublishJob.SuccessStage;
  cancel: () => void;
}

const SuccessStage: React.FC<SuccessStageProps> = ({ stage, cancel }) => {
  switch (stage.data.successType) {
    case GooglePublishJobSuccessType.SUBMIT:
      return <Submitted />;
    case GooglePublishJobSuccessType.UPLOAD:
      return <Uploaded stageData={stage.data} />;
    case GoogleExportJobSuccessType.DOWNLOAD:
      return <DownloadStage cancel={cancel} stageData={stage.data} />;
    default:
      return null;
  }
};

export default SuccessStage;
