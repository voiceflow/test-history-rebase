import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';
import { Permission } from '@/constants/permissions';
import { PRO_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradePopperProps, getUpgradeTooltipProps } from '@/utils/upgrade';

import { UpgradeModalAndTooltipPlanPermission } from './types';

export const NLU_EXPORT_CSV_PERMISSIONS = {
  plans: PRO_PLUS_PLANS,
  permission: Permission.FEATURE_NLU_EXPORT_CSV,

  upgradeModal: () => ({
    ...getUpgradePopperProps(PlanType.PRO, Tracking.UpgradePrompt.EXPORT_CSV_NLU),
    title: 'Need to export data as CSV?',
    header: 'CSV Export',
    description: 'CSV export is a pro feature. Please upgrade to pro to continue.',
  }),

  upgradeTooltip: () => ({
    ...getUpgradeTooltipProps(PlanType.PRO, Tracking.UpgradePrompt.EXPORT_CSV_NLU),
    title: 'Upgrade to Pro',
    description: `${NLP.Voiceflow.CONFIG.name} is a pro feature.`,
  }),
} satisfies UpgradeModalAndTooltipPlanPermission;
