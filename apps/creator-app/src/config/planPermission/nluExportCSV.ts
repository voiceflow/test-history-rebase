import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';
import { Permission } from '@/constants/permissions';
import { TEAM_PLUS_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradePopperProps, getUpgradeTooltipProps } from '@/utils/upgrade';

import { UpgradeModalAndTooltipPlanPermission } from './types';

export const NLU_EXPORT_CSV_PERMISSIONS = {
  plans: TEAM_PLUS_PLANS,
  permission: Permission.NLU_EXPORT_CSV,

  upgradeModal: () => ({
    ...getUpgradePopperProps(PlanType.TEAM, Tracking.UpgradePrompt.EXPORT_CSV_NLU),
    title: `Need to export data as CSV?`,
    header: 'CSV Export',
    description: 'CSV export is a team feature. Please upgrade to team to continue.',
  }),

  upgradeTooltip: () => ({
    ...getUpgradeTooltipProps(PlanType.TEAM, Tracking.UpgradePrompt.EXPORT_CSV_NLU),
    title: 'Upgrade to Team',
    description: `${NLP.Voiceflow.CONFIG.name} is a team feature.`,
  }),
} satisfies UpgradeModalAndTooltipPlanPermission;
