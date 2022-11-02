import { FlexApart, Link } from '@voiceflow/ui';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import * as NLP from '@/config/nlp';
import { getCanvasExportLimitDetails } from '@/config/planLimits/canvasExport';
import { getNLUExportLimitDetails } from '@/config/planLimits/nluExport';
import { ExportFormat, ExportType, ModalType } from '@/constants';
import { UpgradePrompt } from '@/ducks/tracking';
import * as Tracking from '@/ducks/tracking';
import { useModals, useTrackingEvents } from '@/hooks';

import { ExportContext } from './Context';

const ExportFooter: React.FC<{
  withoutLink?: boolean;
  linkURL?: string;
  origin: Tracking.ModelExportOriginType;
}> = ({ withoutLink, origin, linkURL }) => {
  const { isExporting, onExport, exportType, canExport, canvasExportFormat, exportNLPType, exportIntents } = React.useContext(ExportContext)!;
  const noModelData = exportType === ExportType.MODEL && exportIntents.length === 0;

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

      return;
    }

    if (exportType === ExportType.MODEL && exportNLPType && !canExport) {
      if (exportNLPType === NLP.Constants.NLPType.VOICEFLOW) {
        trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.EXPORT_CSV_NLU });
      } else {
        trackingEvents.trackUpgradePrompt({ promptType: UpgradePrompt.EXPORT_NLU });
      }

      const planLimitDetails = getNLUExportLimitDetails(exportNLPType);
      openUpgradeModal({ planLimitDetails, promptOrigin: UpgradePrompt.EXPORT_NLU });

      return;
    }

    onExport(origin);
  };

  return (
    <FlexApart fullWidth>
      {!withoutLink && exportType === ExportType.MODEL ? (
        <Link onClick={openNLUQuickview}>Open NLU Manager</Link>
      ) : (
        <Link href={linkURL || Documentation.PROJECT_EXPORT}>Learn More</Link>
      )}
      <PlatformUploadButton icon="arrowSpin" label="Export" onClick={checkIfCanExport} isActive={!!isExporting} disabled={noModelData} />
    </FlexApart>
  );
};

export default ExportFooter;
