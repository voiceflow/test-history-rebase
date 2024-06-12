import { PlanType } from '@voiceflow/internal';

import * as NLP from '@/config/nlp';
import { Permission } from '@/constants/permissions';
import { ENTERPRISE_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradePopperProps, getUpgradeTooltipProps } from '@/utils/upgrade';

import { UpgradeModalAndTooltipPlanPermission } from './types';

export interface Data {
  nlpType: NLP.Constants.NLPType;
}

export const NLU_EXPORT_ALL_PERMISSIONS = {
  plans: ENTERPRISE_PLANS,
  permission: Permission.FEATURE_NLU_EXPORT_ALL,

  upgradeModal: ({ nlpType }) => ({
    ...getUpgradePopperProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EXPORT_NLU),
    title: `Need to export data for ${NLP.Config.get(nlpType).name}?`,
    header: 'NLU Export',
    description: 'This NLU export is an enterprise feature. Please contact sales to unlock this feature.',
  }),

  upgradeTooltip: ({ nlpType }) => ({
    ...getUpgradeTooltipProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.EXPORT_NLU),
    title: 'Upgrade to Enterprise',
    description: `${NLP.Config.get(nlpType).name} export is a enterprise feature.`,
  }),
} satisfies UpgradeModalAndTooltipPlanPermission<Data>;
