import React from 'react';

import { ProgressStage } from '@/components/PlatformUploadPopup/components';
import { AlexaStageType, DialogflowStageType, GeneralStageType, GoogleStageType, NLPTrainStageType } from '@/constants/platforms';
import { AlexaPublishJob, DialogflowPublishJob, GeneralExportJob, GooglePublishJob, NLPTrainJob } from '@/models';

export interface GeneralProgressStageProps<T, U> {
  job: T | null;
  inProgressStage: U;
}

function GeneralProgressStage<
  T extends DialogflowPublishJob.AnyJob | AlexaPublishJob.AnyJob | GooglePublishJob.AnyJob | GeneralExportJob.AnyJob | NLPTrainJob.AnyJob,
  U extends DialogflowStageType.PROGRESS | AlexaStageType.PROGRESS | GoogleStageType.PROGRESS | GeneralStageType.PROGRESS | NLPTrainStageType.PROGRESS
>({ job, inProgressStage }: React.PropsWithChildren<GeneralProgressStageProps<T, U>>) {
  if (job?.stage.type !== inProgressStage) return null;
  return <ProgressStage progress={job?.stage.data.progress} />;
}

export default GeneralProgressStage;
