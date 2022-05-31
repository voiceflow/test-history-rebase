import { PlanType } from '@voiceflow/internal';

import { LimitDetails, LimitSubmitProps, TEAM_LABEL, UPRADE_TO_TEAM_ACTION_LABEL } from '@/config/planLimits';
import { ExportFormat } from '@/constants';

export enum ExportUpgradeFormat {
  PNG = 'png',
  PDF = 'pdf',
  DIALOGS = 'dialogs',
}

export const GATED_EXPORT_TYPES = new Set([ExportFormat.DIALOGS, ExportFormat.PDF, ExportFormat.PNG]);

const ExportToExportUpgradeFormat = {
  [ExportFormat.DIALOGS]: ExportUpgradeFormat.DIALOGS,
  [ExportFormat.PNG]: ExportUpgradeFormat.PNG,
  [ExportFormat.PDF]: ExportUpgradeFormat.PDF,
  [ExportFormat.JSON]: undefined,
  [ExportFormat.VF]: undefined,
};

export const ExportUpgradeFormatLabels = {
  [ExportUpgradeFormat.DIALOGS]: 'CSV',
  [ExportUpgradeFormat.PDF]: 'PDF',
  [ExportUpgradeFormat.PNG]: 'PNG',
};

const canvasExportTeamPlanLimitDetails = (exportFormat: ExportUpgradeFormat) => {
  return {
    modalTitle: `${ExportUpgradeFormatLabels[exportFormat]} Export`,
    title: `Need to export as ${ExportUpgradeFormatLabels[exportFormat]}?`,
    description: `${ExportUpgradeFormatLabels[exportFormat]} export is a ${TEAM_LABEL} feature. Upgrade to the ${TEAM_LABEL} plan to unlock this feature.`,
    submitText: UPRADE_TO_TEAM_ACTION_LABEL,
    onSubmit: ({ openPaymentModal }: LimitSubmitProps) => openPaymentModal(),
  };
};

export const CanvasExportLimitDetails: Record<ExportUpgradeFormat, LimitDetails> = {
  [ExportUpgradeFormat.DIALOGS]: canvasExportTeamPlanLimitDetails(ExportUpgradeFormat.DIALOGS),
  [ExportUpgradeFormat.PDF]: canvasExportTeamPlanLimitDetails(ExportUpgradeFormat.PDF),
  [ExportUpgradeFormat.PNG]: canvasExportTeamPlanLimitDetails(ExportUpgradeFormat.PNG),
};

export const getCanvasExportTooltipTitle = (option: ExportFormat) => {
  const exportOption = ExportToExportUpgradeFormat[option];
  if (exportOption) {
    return `${ExportUpgradeFormatLabels[exportOption]} is a team feature.`;
  }
  return undefined;
};

export const getCanvasExportLimitDetails = (exportType: ExportFormat): LimitDetails | null => {
  const exportOption = ExportToExportUpgradeFormat[exportType];
  if (exportOption) {
    return CanvasExportLimitDetails[exportOption];
  }
  return null;
};

export const getCanvasExportLimitPlan = (exportType: ExportFormat): PlanType => {
  if (GATED_EXPORT_TYPES.has(exportType)) {
    return PlanType.TEAM;
  }
  return PlanType.STARTER;
};

export const isGatedCanvasExportType = (exportType: ExportFormat, canExport: boolean) => {
  return !canExport && GATED_EXPORT_TYPES.has(exportType);
};
