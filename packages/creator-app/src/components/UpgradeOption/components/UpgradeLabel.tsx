import { PlanType } from '@voiceflow/internal';
import { FlexApart, getNestedMenuFormattedLabel, GetOptionLabel, GetOptionValue, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import {
  ENTERPRISE_LIMIT_PLANS,
  TEAM_LIMIT_PLANS,
  UPGRADE_TO_ENTERPRISE_ACTION_LABEL,
  UPGRADE_TO_TEAM_ACTION_LABEL,
  upgradeToEnterpriseAction,
  upgradeToTeamAction,
} from '@/config/planLimits';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import { GatedFeatureIcon } from '.';

interface UpgradeLabelProps<T, U> {
  option: T;
  isFocused?: boolean;
  searchLabel?: string | null;
  getOptionLabel: GetOptionLabel<U>;
  getOptionValue: GetOptionValue<T, U>;
  isGated?: boolean;
  tooltipTitle?: string;
  plan?: PlanType;
}

const UpgradeLabel = <T extends unknown, U extends unknown>({
  option,
  isFocused,
  searchLabel,
  getOptionLabel,
  getOptionValue,
  isGated,
  tooltipTitle,
  plan,
}: UpgradeLabelProps<T, U>): React.ReactElement | null => {
  const optionLabel = getOptionLabel(getOptionValue(option));
  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);

  const handleTooltipOnClick = () => {
    if (plan && TEAM_LIMIT_PLANS.includes(plan)) {
      upgradeToTeamAction({ openPaymentModal });
    } else if (plan && ENTERPRISE_LIMIT_PLANS.includes(plan)) {
      upgradeToEnterpriseAction();
    }
  };

  const getButtonText = () => {
    if (plan && TEAM_LIMIT_PLANS.includes(plan)) {
      return UPGRADE_TO_TEAM_ACTION_LABEL;
    }
    if (plan && ENTERPRISE_LIMIT_PLANS.includes(plan)) {
      return UPGRADE_TO_ENTERPRISE_ACTION_LABEL;
    }
    return '';
  };

  return (
    <FlexApart fullWidth>
      <span>{getNestedMenuFormattedLabel(optionLabel, searchLabel)}</span>
      {isGated && (
        <TippyTooltip
          {...{
            position: 'left',
            interactive: true,
            html: <TippyTooltip.FooterButton buttonText={getButtonText()} width={200} onClick={handleTooltipOnClick} title={tooltipTitle} />,
          }}
        >
          <GatedFeatureIcon isItemFocused={isFocused} />
        </TippyTooltip>
      )}
    </FlexApart>
  );
};

export default UpgradeLabel;
