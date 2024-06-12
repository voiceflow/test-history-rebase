import { PlanType } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';

import * as NLU from '@/config/nlu';
import { Permission } from '@/constants/permissions';
import { ENTERPRISE_PLANS } from '@/constants/plans';
import * as Tracking from '@/ducks/tracking';
import { getUpgradePopperProps, getUpgradeTooltipProps } from '@/utils/upgrade';

import { UpgradePopperAndTooltipPlanPermission } from './types';

export interface Data {
  nluType: Platform.Constants.NLUType;
}

export const NLU_CUSTOM_PERMISSIONS = {
  plans: ENTERPRISE_PLANS,
  permission: Permission.FEATURE_NLU_CUSTOM,

  upgradePopper: ({ nluType }) => ({
    ...getUpgradePopperProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.SUPPORTED_NLUS),
    title: 'Upgrade to Enterprise',
    description: `${NLU.Config.get(nluType).nlps[0].name} is a enterprise feature.`,
  }),

  upgradeTooltip: ({ nluType }) => ({
    ...getUpgradeTooltipProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.SUPPORTED_NLUS),
    title: 'Upgrade to Enterprise',
    description: `${NLU.Config.get(nluType).nlps[0].name} is an enterprise feature. Upgrade to import and export data for this NLU.`,
  }),
} satisfies UpgradePopperAndTooltipPlanPermission<Data>;
