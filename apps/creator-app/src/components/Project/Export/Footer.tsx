import { Box, System } from '@voiceflow/ui';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import * as NLP from '@/config/nlp';
import { ExportType } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Tracking from '@/ducks/tracking';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePermissionAction } from '@/hooks/permission';

import { Context } from './Context';

interface FooterProps {
  origin: Tracking.ModelExportOriginType;
  linkURL?: string;
  withoutLink?: boolean;
  selectedItems?: string[];
}

export const Footer: React.FC<FooterProps> = ({ origin, linkURL, selectedItems }) => {
  const { onExport, exportType, isExporting, canvasExportFormat, exportNLPType, exportIntents } = React.useContext(Context)!;

  const noModelData = exportType === ExportType.MODEL && exportIntents.length === 0 && !selectedItems?.length;

  const upgradeModal = useUpgradeModal();

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
    <Box.FlexApart fullWidth>
      <System.Link.Anchor href={linkURL || Documentation.PROJECT_EXPORT}>Learn More</System.Link.Anchor>
      <PlatformUploadButton icon="arrowSpin" label="Export" onClick={onExportClick} isActive={!!isExporting} disabled={noModelData} />
    </Box.FlexApart>
  );
};
