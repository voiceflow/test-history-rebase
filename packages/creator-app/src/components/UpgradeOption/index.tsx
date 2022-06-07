import { PlanType } from '@voiceflow/internal';
import { FlexApart, getNestedMenuFormattedLabel, GetOptionLabel, GetOptionValue, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { ENTERPRISE_LIMIT_PLANS, TEAM_LIMIT_PLANS } from '@/config/planLimits';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks';

import GatedFeatureIcon from './components/GatedFeatureIcon';

interface UpgradeOptionProps<T, U> {
  option: T;
  isFocused?: boolean;
  searchLabel?: string | null;
  getOptionLabel: GetOptionLabel<U>;
  getOptionValue: GetOptionValue<T, U>;
  isGated?: boolean;
  tooltipTitle?: string;
  plan?: PlanType;
}

const UpgradeOption = <T extends unknown, U extends unknown>({
  option,
  isFocused,
  searchLabel,
  getOptionLabel,
  getOptionValue,
  isGated,
  tooltipTitle,
  plan,
}: UpgradeOptionProps<T, U>): React.ReactElement | null => {
  const optionLabel = getOptionLabel(getOptionValue(option));
  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);

  const handleOnClick = () => {
    if (plan && TEAM_LIMIT_PLANS.includes(plan)) {
      openPaymentModal();
    } else if (plan && ENTERPRISE_LIMIT_PLANS.includes(plan)) {
      window.open('https://www.voiceflow.com/demo');
    }
  };

  const getButtonText = () => {
    if (plan && TEAM_LIMIT_PLANS.includes(plan)) {
      return 'Upgrade to Team';
    }
    if (plan && ENTERPRISE_LIMIT_PLANS.includes(plan)) {
      return 'Contact Sales';
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
            html: <TippyTooltip.FooterButton buttonText={getButtonText()} width={200} onClick={handleOnClick} title={tooltipTitle} />,
          }}
        >
          <GatedFeatureIcon isItemFocused={isFocused} />
        </TippyTooltip>
      )}
    </FlexApart>
  );
};

export default UpgradeOption;
