import { DataTypes, download, toast, useSetup } from '@voiceflow/ui';
import React from 'react';

import { StageComponentProps } from '@/platforms/types';

const JobInterfaceDownloadStage: React.FC<StageComponentProps<{ type: any; data: { fileName: string; data: string } }>> = ({ cancel, stage }) => {
  useSetup(() => {
    download(stage.data.fileName, stage.data.data, DataTypes.JSON);
    toast.success('Code successfully exported');
    cancel();
  });

  return null;
};

export default JobInterfaceDownloadStage;
