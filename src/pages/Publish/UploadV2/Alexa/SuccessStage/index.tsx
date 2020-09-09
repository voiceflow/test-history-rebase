import React from 'react';

import { AlexaExportJobSuccessType, AlexaPublishJobSuccessType } from '@/constants/platforms';
import { AlexaExportJob, AlexaPublishJob } from '@/models';

import { Download, Submitted, Uploaded } from './components';

type SuccessStageProps = {
  stage: AlexaExportJob.SuccessStage | AlexaPublishJob.SuccessStage;
  cancel: () => void;
};

const SuccessStage: React.FC<SuccessStageProps> = ({ stage, cancel }) => {
  switch (stage.data.successType) {
    case AlexaPublishJobSuccessType.SUBMIT:
      return <Submitted />;
    case AlexaPublishJobSuccessType.UPLOAD:
      return <Uploaded stageData={stage.data} />;
    case AlexaExportJobSuccessType.DOWNLOAD:
      return <Download cancel={cancel} stageData={stage.data} />;
    default:
      return null;
  }
};

export default SuccessStage;
