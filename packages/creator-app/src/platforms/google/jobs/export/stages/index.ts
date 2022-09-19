import { createUseJobInterfaceContent, DownloadStage } from '@/components/JobInterface';
import { GoogleStageType } from '@/constants/platforms';
import { GoogleExportJob } from '@/models';

import { PublishStageContent } from '../../publish/stages';

export const ExportStageContent = {
  ...PublishStageContent,
  [GoogleStageType.SUCCESS]: {
    Component: DownloadStage,
  },
};

export const useaGoogleExportStageContent = createUseJobInterfaceContent<GoogleExportJob.AnyJob>(ExportStageContent);
