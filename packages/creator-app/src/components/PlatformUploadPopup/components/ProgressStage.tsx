import React from 'react';

import PageProgressBar from '@/components/PageProgressBar';

export interface ProgressStageProps {
  progress: number;
}

const ProgressStage: React.FC<ProgressStageProps> = ({ progress }) => <PageProgressBar progress={progress} />;

export default ProgressStage;
