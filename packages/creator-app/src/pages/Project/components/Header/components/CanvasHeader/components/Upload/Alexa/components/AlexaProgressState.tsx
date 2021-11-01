import React from 'react';

import { ProgressStage } from '@/components/PlatformUploadPopup/components';
import { AlexaStageType } from '@/constants/platforms';
import { AlexaPublishJob } from '@/models';

interface AlexaProgressStateProps {
  alexaJob: AlexaPublishJob.AnyJob | null;
}

const AlexaProgressState: React.FC<AlexaProgressStateProps> = ({ alexaJob }) => {
  if (alexaJob?.stage.type !== AlexaStageType.PROGRESS) return null;

  return <ProgressStage progress={alexaJob?.stage.data.progress} />;
};

export default AlexaProgressState;
