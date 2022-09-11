import { DataTypes, download, toast, useSetup } from '@voiceflow/ui';
import React from 'react';

import { AlexaExportJob, DialogflowExportJob, GeneralJob, GoogleExportJob, JobStageData } from '@/models';

interface DownloadProps {
  cancel: () => void;
  stageData:
    | JobStageData<AlexaExportJob.SuccessStage>
    | JobStageData<GoogleExportJob.SuccessStage>
    | JobStageData<DialogflowExportJob.SuccessStage>
    | JobStageData<GeneralJob.SuccessStage>;
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
