import React from 'react';

import { DialogflowExportJobSuccessType, DialogflowPublishJobSuccessType } from '@/constants/platforms';
import { DialogflowExportJob, DialogflowPublishJob } from '@/models';

import { DownloadStage } from '../components';
import { Submitted, Uploaded } from './components';

interface SuccessStageProps {
  stage: DialogflowExportJob.SuccessStage | DialogflowPublishJob.SuccessStage;
  cancel: () => void;
}

const SuccessStage: React.FC<SuccessStageProps> = ({ stage, cancel }) => {
  switch (stage.data.successType) {
    case DialogflowPublishJobSuccessType.SUBMIT:
      return <Submitted />;
    case DialogflowPublishJobSuccessType.UPLOAD:
      return <Uploaded stageData={stage.data} />;
    case DialogflowExportJobSuccessType.DOWNLOAD:
      return <DownloadStage cancel={cancel} stageData={stage.data} />;
    default:
      return null;
  }
};

export default SuccessStage;
