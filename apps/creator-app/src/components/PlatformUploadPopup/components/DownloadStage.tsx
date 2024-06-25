import { DataTypes, download, toast, useSetup } from '@voiceflow/ui';
import type React from 'react';

import type { AlexaExportJob, GeneralExportJob, GoogleExportJob, JobStageData } from '@/models';

interface DownloadProps {
  cancel: () => void;
  stageData:
    | JobStageData<AlexaExportJob.SuccessStage>
    | JobStageData<GoogleExportJob.SuccessStage>
    | JobStageData<GeneralExportJob.SuccessStage>;
}

const Download: React.FC<DownloadProps> = ({ cancel, stageData }) => {
  useSetup(() => {
    download(stageData.fileName, stageData.data, DataTypes.JSON);
    toast.success('Code successfully exported ');
    cancel();
  });

  return null;
};

export default Download;
