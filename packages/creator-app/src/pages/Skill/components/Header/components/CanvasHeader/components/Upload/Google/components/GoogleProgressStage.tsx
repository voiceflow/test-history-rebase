import React from 'react';

import { ProgressStage } from '@/components/PlatformUploadPopup/components';
import { GoogleStageType } from '@/constants/platforms';
import { GooglePublishJob } from '@/models';

interface GoogleProgressStateProps {
  googleJob: GooglePublishJob.AnyJob | null;
}

const GoogleProgressStage: React.FC<GoogleProgressStateProps> = ({ googleJob }) => {
  if (googleJob?.stage.type !== GoogleStageType.PROGRESS) return null;

  return <ProgressStage progress={googleJob.stage.data.progress} />;
};

export default GoogleProgressStage;
