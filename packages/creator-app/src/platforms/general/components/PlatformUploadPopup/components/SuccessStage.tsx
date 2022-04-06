import React from 'react';

import { DownloadStage } from '@/components/PlatformUploadPopup/components';
import { GeneralJobSuccessType } from '@/constants/platforms';
import { GeneralJob } from '@/models';

interface SuccessStageProps {
  stage: GeneralJob.SuccessStage;
  cancel: () => void;
}

const SuccessStage: React.FC<SuccessStageProps> = ({ stage, cancel }) => {
  if (stage.data.successType !== GeneralJobSuccessType.DOWNLOAD) {
    return null;
  }

  return <DownloadStage cancel={cancel} stageData={stage.data} />;
};

export default SuccessStage;
