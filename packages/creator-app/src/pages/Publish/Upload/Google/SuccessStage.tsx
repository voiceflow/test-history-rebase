import React from 'react';

import { FeatureFlag } from '@/config/features';
import { GoogleExportJobSuccessType, GooglePublishJobSuccessType } from '@/constants/platforms';
import { useFeature } from '@/hooks';
import { GoogleExportJob, GooglePublishJob } from '@/models';

import { DownloadStage } from '../components';
import { Submitted, Uploaded } from './components';
import DFESUploaded from './components/DFESUploaded';

interface SuccessStageProps {
  stage: GoogleExportJob.SuccessStage | GooglePublishJob.SuccessStage;
  cancel: () => void;
}

const SuccessStage: React.FC<SuccessStageProps> = ({ stage, cancel }) => {
  const isDialogFlow = useFeature(FeatureFlag.DIALOGFLOW)?.isEnabled;
  switch (stage.data.successType) {
    case GooglePublishJobSuccessType.SUBMIT:
      return <Submitted />;
    case GooglePublishJobSuccessType.UPLOAD:
      return isDialogFlow ? <DFESUploaded stageData={stage.data} /> : <Uploaded stageData={stage.data} />;
    case GoogleExportJobSuccessType.DOWNLOAD:
      return <DownloadStage cancel={cancel} stageData={stage.data} />;
    default:
      return null;
  }
};

export default SuccessStage;
