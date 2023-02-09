import { FlexApart, Link } from '@voiceflow/ui';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import * as NLP from '@/config/nlp';
import { ExportType, ModalType } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Tracking from '@/ducks/tracking';
import { useModals } from '@/hooks/modals';
import { usePermissionAction } from '@/hooks/permission';
import { useUpgradeModal } from '@/ModalsV2/hooks';

import { ExportContext } from './Context';

interface ExportFooterProps {
  origin: Tracking.ModelExportOriginType;
  linkURL?: string;
  withoutLink?: boolean;
  selectedItems?: string[];
}

const ExportFooter: React.FC<ExportFooterProps> = ({ origin, linkURL, withoutLink, selectedItems }) => {
  const { onExport, exportType, isExporting, canvasExportFormat, exportNLPType, exportIntents } = React.useContext(ExportContext)!;

  const noModelData = exportType === ExportType.MODEL && exportIntents.length === 0 && !selectedItems?.length;

  const upgradeModal = useUpgradeModal();
  const { open: openNLUQuickView } = useModals(ModalType.NLU_MODEL_QUICK_VIEW);

  const onExportCanvas = usePermissionAction(Permission.CANVAS_EXPORT, {
    onAction: () => onExport(origin),

    isAllowed: ({ planConfig }) => !planConfig?.isPaidExportFormat(canvasExportFormat),

    onPlanForbid: ({ planConfig }) =>
      planConfig.isPaidExportFormat(canvasExportFormat) && upgradeModal.openVoid(planConfig.upgradeModal({ format: canvasExportFormat })),
  });

  const onExportNLUAll = usePermissionAction(Permission.NLU_EXPORT_ALL, {
    onAction: () => onExport(origin),

    onPlanForbid: ({ planConfig }) => exportNLPType && upgradeModal.openVoid(planConfig.upgradeModal({ nlpType: exportNLPType })),
  });

  const onExportNLUCSV = usePermissionAction(Permission.NLU_EXPORT_CSV, {
    onAction: () => onExport(origin),

    onPlanForbid: ({ planConfig }) => upgradeModal.openVoid(planConfig.upgradeModal()),
  });

  const onExportClick = () => {
    if (isExporting) return;

    if (exportType === ExportType.CANVAS) {
      onExportCanvas();
      return;
    }

    if (exportNLPType === NLP.Constants.NLPType.VOICEFLOW) {
      onExportNLUCSV();
      return;
    }

    onExportNLUAll();
  };

  return (
    <FlexApart fullWidth>
      {!withoutLink && exportType === ExportType.MODEL ? (
        <Link onClick={() => openNLUQuickView()}>Open NLU Manager</Link>
      ) : (
        <Link href={linkURL || Documentation.PROJECT_EXPORT}>Learn More</Link>
      )}
      <PlatformUploadButton icon="arrowSpin" label="Export" onClick={onExportClick} isActive={!!isExporting} disabled={noModelData} />
    </FlexApart>
  );
};

export default ExportFooter;
