import { FlexApart, Link } from '@voiceflow/ui';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import { getCanvasExportLimitDetails } from '@/config/planLimits/canvasExport';
import { getNLUExportLimitDetails } from '@/config/planLimits/nluExport';
import { ExportFormat, ExportType, ModalType, NLPProvider } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import { UpgradePrompt } from '@/ducks/tracking';
import * as Tracking from '@/ducks/tracking';
import { useModals, useSelector, useTrackingEvents } from '@/hooks';

import { ExportContext } from './Context';

const ExportFooter: React.FC<{
  withoutLink?: boolean;
  origin: Tracking.ModelExportOriginType;
}> = ({ withoutLink, origin }) => {
  const { isExporting, onExport, exportType, canExport, canvasExportFormat, modelExportProvider } = React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);
  const noModelData = exportType === ExportType.MODEL && intents.length === 0;

  const [trackingEvents] = useTrackingEvents();

  const { open: openNLUQuickview } = useModals(ModalType.NLU_MODEL_QUICK_VIEW);
  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);

  const checkIfCanExport = () => {
    if (isExporting) return;
    if (exportType === ExportType.CANVAS && canvasExportFormat && !canExport) {
      if (canvasExportFormat === ExportFormat.VF) {
        trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.EXPORT_PROJECT_CSV });
      } else {
        trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.EXPORT_PROJECT });
      }
      const planLimitDetails = getCanvasExportLimitDetails(canvasExportFormat);
      openUpgradeModal({ planLimitDetails, promptOrigin: UpgradePrompt.EXPORT_PROJECT });
    } else if (exportType === ExportType.MODEL && modelExportProvider && !canExport) {
      if (modelExportProvider === NLPProvider.VF_CSV) {
        trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.EXPORT_CSV_NLU });
      } else {
        trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.EXPORT_NLU });
      }
      const planLimitDetails = getNLUExportLimitDetails(modelExportProvider);
      openUpgradeModal({ planLimitDetails, promptOrigin: UpgradePrompt.EXPORT_NLU });
    } else {
      onExport(origin);
    }
  };

  return (
    <FlexApart fullWidth>
      {!withoutLink && exportType === ExportType.MODEL ? (
        <Link onClick={openNLUQuickview}>Open NLU Manager</Link>
      ) : (
        <Link href={Documentation.PROJECT_EXPORT}>Learn More</Link>
      )}
      <PlatformUploadButton icon="arrowSpin" label="Export" onClick={checkIfCanExport} isActive={!!isExporting} disabled={noModelData} />
    </FlexApart>
  );
};

export default ExportFooter;
