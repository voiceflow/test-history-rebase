import React from 'react';

import { GeneralStageType } from '@/constants/platforms';
import { ExportContext } from '@/pages/Skill/contexts';

import { LoaderStage, ProgressStage } from '../components';
import ErrorStage from './ErrorStage';
import SuccessStage from './SuccessStage';

export const General: React.FC = () => {
  const exportValue = React.useContext(ExportContext)!;

  switch (exportValue.job?.stage.type) {
    case GeneralStageType.IDLE:
      return <LoaderStage />;
    case GeneralStageType.PROGRESS:
      return <ProgressStage progress={exportValue.job.stage.data.progress}>{exportValue.job.stage.data.message}</ProgressStage>;
    case GeneralStageType.ERROR:
      return <ErrorStage stage={exportValue.job.stage} />;
    case GeneralStageType.SUCCESS:
      return <SuccessStage stage={exportValue.job.stage} cancel={exportValue.cancel} />;
    default:
      return null;
  }
};

export default General;
