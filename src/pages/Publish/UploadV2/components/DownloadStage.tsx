import React from 'react';

import { toast } from '@/components/Toast';
import { useSetup } from '@/hooks';
import { AlexaExportJob, GoogleExportJob, JobStageData } from '@/models';
import { DataTypes, download } from '@/utils/dom';

type DownloadProps = {
  cancel: () => void;
  stageData: JobStageData<AlexaExportJob.SuccessStage> | JobStageData<GoogleExportJob.SuccessStage>;
};

const Download: React.FC<DownloadProps> = ({ cancel, stageData }) => {
  useSetup(() => {
    download(stageData.fileName, stageData.data, DataTypes.JSON);
    toast.success('Code successfully exported ');
    cancel();
  });

  return null;
};

export default Download;
