import React from 'react';

import { ProgressStage } from '@/components/PlatformUploadPopup/components';
import { DialogflowStageType } from '@/constants/platforms';
import { DialogflowPublishJob } from '@/models';

interface DialogflowProgressStateProps {
  dialogflowPublishJob: DialogflowPublishJob.AnyJob | null;
}

const DialogflowProgressStage: React.FC<DialogflowProgressStateProps> = ({ dialogflowPublishJob }) => {
  if (dialogflowPublishJob?.stage.type !== DialogflowStageType.PROGRESS) return null;

  return <ProgressStage progress={dialogflowPublishJob.stage.data.progress} />;
};

export default DialogflowProgressStage;
