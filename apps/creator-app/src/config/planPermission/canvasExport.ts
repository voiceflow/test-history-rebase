import { PlanType } from '@voiceflow/internal';

import { ExportFormat } from '@/constants';
import { Permission } from '@/constants/permissions';
import { TEAM_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradePopperProps, getUpgradeTooltipProps } from '@/utils/upgrade';

import { UpgradeModalAndTooltipPlanPermission } from './types';

export type PaidExportFormat = ExportFormat.DIALOGS | ExportFormat.PDF | ExportFormat.PNG;
export const PAID_EXPORT_FORMATS = new Set<PaidExportFormat>([ExportFormat.DIALOGS, ExportFormat.PDF, ExportFormat.PNG]);

export const PAID_EXPORT_LABELS: Record<ExportFormat, string> = {
  [ExportFormat.VF]: 'CSV',
  [ExportFormat.PDF]: 'PDF',
  [ExportFormat.PNG]: 'PNG',
  [ExportFormat.JSON]: 'JSON',
  [ExportFormat.DIALOGS]: 'CSV',
};

export interface Data {
  format: ExportFormat;
}

export interface CanvasExportPermission extends UpgradeModalAndTooltipPlanPermission<Data> {
  isPaidExportFormat: (format?: ExportFormat | null) => format is PaidExportFormat;
}

export const CANVAS_EXPORT_PERMISSIONS = {
  plans: [...TEAM_PLANS, PlanType.STUDENT, PlanType.ENTERPRISE],
  permission: Permission.CANVAS_EXPORT,

  isPaidExportFormat: (format?: ExportFormat | null): format is PaidExportFormat => !!format && PAID_EXPORT_FORMATS.has(format as PaidExportFormat),

  upgradeModal: ({ format }) => ({
    ...getUpgradePopperProps(PlanType.TEAM, Tracking.UpgradePrompt.EXPORT_PROJECT),
    title: `Need to export as ${PAID_EXPORT_LABELS[format]}?`,
    header: `${PAID_EXPORT_LABELS[format]} Export`,
    description: `${PAID_EXPORT_LABELS[format]} export is a team feature. Upgrade to the team plan to unlock this feature.`,
  }),

  upgradeTooltip: ({ format }) => ({
    ...getUpgradeTooltipProps(PlanType.TEAM, Tracking.UpgradePrompt.EXPORT_PROJECT),
    title: 'Upgrade to Team',
    description: `${PAID_EXPORT_LABELS[format]} export is a team feature.`,
  }),
} satisfies CanvasExportPermission;
