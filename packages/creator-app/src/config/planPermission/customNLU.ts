import { PlanType } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';

import * as NLU from '@/config/nlu';
import * as Tracking from '@/ducks/tracking';
import { getUpgradeToModalProps } from '@/utils/upgrade';

import { PlanPermission, UpgradePopperAndTooltipPermission } from './types';
import { applyStarterPermissions, applyTeamPermissions } from './utils';

interface Data {
  nluType: Platform.Constants.NLUType;
}

const ENTERPRISE_PERMISSION: UpgradePopperAndTooltipPermission<Data> = {
  getUpgradeTooltip: ({ nluType }) => {
    const nlpConfig = NLU.Config.get(nluType).nlps[0];

    return {
      ...getUpgradeToModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.SUPPORTED_NLUS),
      description: `${nlpConfig.name} is a enterprise feature.`,
    };
  },

  getUpgradePopper: ({ nluType }) => {
    const nlpConfig = NLU.Config.get(nluType).nlps[0];

    return {
      ...getUpgradeToModalProps(PlanType.ENTERPRISE, Tracking.UpgradePrompt.SUPPORTED_NLUS),
      title: 'Upgrade to Enterprise',
      description: `${nlpConfig.name} is an Enterprise feature. Upgrade to import and export data for this NLU.`,
    };
  },
};

export const CUSTOM_NLU_PERMISSIONS: PlanPermission<UpgradePopperAndTooltipPermission<Data>> = {
  ...applyTeamPermissions(ENTERPRISE_PERMISSION),
  ...applyStarterPermissions(ENTERPRISE_PERMISSION),
};
