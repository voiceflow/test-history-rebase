import { createUseJobInterfaceContent } from '@/components/JobInterface';
import { AlexaStageType } from '@/constants/platforms';
import { AlexaPublishJob } from '@/models';

import { PublishStageContent } from '../../publish/stages';
import SubmitStage from './SubmitStage';

export const SubmitStageContent = {
  ...PublishStageContent,
  [AlexaStageType.SUCCESS]: {
    Component: SubmitStage,
  },
};

export const useAlexaSubmitStageContent = createUseJobInterfaceContent<AlexaPublishJob.AnyJob>(SubmitStageContent);
