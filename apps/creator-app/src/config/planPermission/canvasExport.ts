import { PlanType } from '@voiceflow/internal';

import { ExportFormat } from '@/constants';
import { Permission } from '@/constants/permissions';
import { STUDENT_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradePopperProps, getUpgradeTooltipProps } from '@/utils/upgrade';

import { UpgradeModalAndTooltipPlanPermission } from './types';

export type PaidExportFormat = ExportFormat.DIALOGS | ExportFormat.PDF | ExportFormat.PNG;
export const PAID_EXPORT_FORMATS = new Set<PaidExportFormat>([
  ExportFormat.DIALOGS,
  ExportFormat.PDF,
  ExportFormat.PNG,
]);

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
  plans: STUDENT_PLUS_PLANS,
  permission: Permission.FEATURE_CANVAS_EXPORT,

  isPaidExportFormat: (format?: ExportFormat | null): format is PaidExportFormat =>
    !!format && PAID_EXPORT_FORMATS.has(format as PaidExportFormat),

  upgradeModal: ({ format }) => ({
    ...getUpgradePopperProps(PlanType.PRO, Tracking.UpgradePrompt.EXPORT_PROJECT),
    title: `Need to export as ${PAID_EXPORT_LABELS[format]}?`,
    header: `${PAID_EXPORT_LABELS[format]} Export`,
    description: `${PAID_EXPORT_LABELS[format]} export is a pro feature. Upgrade to the pro plan to unlock this feature.`,
  }),

  upgradeTooltip: ({ format }) => ({
    ...getUpgradeTooltipProps(PlanType.PRO, Tracking.UpgradePrompt.EXPORT_PROJECT),
    title: 'Upgrade to Pro',
    description: `${PAID_EXPORT_LABELS[format]} export is a pro feature.`,
  }),
} satisfies CanvasExportPermission;
