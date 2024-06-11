import { tid } from '@voiceflow/style';
import { Box, System } from '@voiceflow/ui';
import { BaseProps } from '@voiceflow/ui-next';
import React from 'react';

import PlatformUploadButton from '@/components/PlatformUploadButton';
import * as Documentation from '@/config/documentation';
import * as NLP from '@/config/nlp';
import { ExportType } from '@/constants';
import { Permission } from '@/constants/permissions';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { usePermissionAction } from '@/hooks/permission';

import { Context } from './Context';

interface FooterProps extends BaseProps {
  origin?: string;
  linkURL?: string;
  withoutLink?: boolean;
  selectedItems?: string[];
}

export const Footer: React.FC<FooterProps> = ({ origin = 'Share Menu', linkURL, selectedItems, testID }) => {
  const { onExport, exportType, isExporting, canvasExportFormat, exportNLPType, exportIntents } =
    React.useContext(Context)!;

  const noModelData = exportType === ExportType.MODEL && exportIntents.length === 0 && !selectedItems?.length;

  const upgradeModal = useUpgradeModal();

  const onExportCanvas = usePermissionAction(Permission.CANVAS_EXPORT, {
    onAction: () => onExport(origin),

    isAllowed: ({ planConfig }) => !planConfig?.isPaidExportFormat(canvasExportFormat),

    onPlanForbid: ({ planConfig }) =>
      planConfig.isPaidExportFormat(canvasExportFormat) &&
      upgradeModal.openVoid(planConfig.upgradeModal({ format: canvasExportFormat })),
  });

  const onExportNLUAll = usePermissionAction(Permission.FEATURE_NLU_EXPORT_ALL, {
    onAction: () => onExport(origin),

    onPlanForbid: ({ planConfig }) =>
      exportNLPType && upgradeModal.openVoid(planConfig.upgradeModal({ nlpType: exportNLPType })),
  });

  const onExportNLUCSV = usePermissionAction(Permission.FEATURE_NLU_EXPORT_CSV, {
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
      <System.Link.Anchor href={linkURL || Documentation.PROJECT_EXPORT} data-testid={tid(testID, 'learn-more')}>
        Learn More
      </System.Link.Anchor>
      <PlatformUploadButton
        icon="arrowSpin"
        label="Export"
        onClick={onExportClick}
        isActive={!!isExporting}
        disabled={noModelData}
      />
    </Box.FlexApart>
  );
};
