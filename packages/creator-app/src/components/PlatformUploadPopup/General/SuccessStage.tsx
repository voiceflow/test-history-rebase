import React from 'react';

import { GeneralJobSuccessType } from '@/constants/platforms';
import { GeneralExportJob } from '@/models';

import { DownloadStage } from '../components';

interface SuccessStageProps {
  stage: GeneralExportJob.SuccessStage;
  cancel: () => void;
}

const SuccessStage: React.FC<SuccessStageProps> = ({ stage, cancel }) => {
  if (stage.data.successType !== GeneralJobSuccessType.DOWNLOAD) {
    return null;
  }

  return <DownloadStage cancel={cancel} stageData={stage.data} />;
};

export default SuccessStage;
