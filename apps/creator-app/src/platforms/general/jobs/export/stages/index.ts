import { createUseJobInterfaceContent, DownloadStage } from '@/components/JobInterface';
import { ErrorStage } from '@/components/PlatformUploadPopup/components';
import { GeneralStageType } from '@/constants/platforms';
import { GeneralExportJob } from '@/models';

export const useGeneralExportStageContent = createUseJobInterfaceContent<GeneralExportJob.AnyJob>({
  [GeneralStageType.ERROR]: {
    Popup: { Component: ErrorStage, closeable: true },
  },
  [GeneralStageType.SUCCESS]: {
    Component: DownloadStage,
  },
});
