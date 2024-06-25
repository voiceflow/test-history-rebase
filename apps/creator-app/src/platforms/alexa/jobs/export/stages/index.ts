import { createUseJobInterfaceContent, DownloadStage } from '@/components/JobInterface';
import { AlexaStageType } from '@/constants/platforms';
import type { AlexaExportJob } from '@/models';

import { PublishStageContent } from '../../publish/stages';

export const ExportStageContent = {
  ...PublishStageContent,
  [AlexaStageType.SUCCESS]: {
    Component: DownloadStage,
  },
};

export const useAlexaExportStageContent = createUseJobInterfaceContent<AlexaExportJob.AnyJob>(ExportStageContent);
