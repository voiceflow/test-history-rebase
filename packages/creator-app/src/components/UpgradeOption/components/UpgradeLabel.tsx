import { PlanType } from '@voiceflow/internal';
import { FlexApart, getNestedMenuFormattedLabel, GetOptionLabel, GetOptionValue, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { LimitDetails } from '@/config/planLimits';
import { ModalType } from '@/constants';
import { useModals } from '@/hooks/modals';

import GatedFeatureIcon from './GatedFeatureIcon';
import { getLabelTooltip, getUpgradeTooltip } from './getOptionTooltips';

interface UpgradeLabelProps<T, U> {
  option: T;
  isFocused?: boolean;
  searchLabel?: string | null;
  getOptionLabel: GetOptionLabel<U>;
  getOptionValue: GetOptionValue<T, U>;
  isGated?: boolean;
  planDetails?: LimitDetails | null;
}

const UpgradeLabel = <T extends unknown, U extends unknown>({
  option,
  isFocused,
  searchLabel,
  getOptionLabel,
  getOptionValue,
  isGated = false,
  planDetails,
}: UpgradeLabelProps<T, U>): React.ReactElement | null => {
  const optionLabel = getOptionLabel(getOptionValue(option));
  const { open: openPaymentModal } = useModals<{ planType: PlanType }>(ModalType.PAYMENT);

  const handleTooltipOnClick = () => {
    if (planDetails?.tooltipOnClick) planDetails?.tooltipOnClick({ openPaymentModal });
  };

  return (
    <FlexApart fullWidth>
      {planDetails?.hasLabelTooltip ? (
        <TippyTooltip {...getLabelTooltip(planDetails.labelTooltipTitle, planDetails.labelTooltipText, isGated)}>
          <span>{getNestedMenuFormattedLabel(optionLabel, searchLabel)}</span>
        </TippyTooltip>
      ) : (
        <span>{getNestedMenuFormattedLabel(optionLabel, searchLabel)}</span>
      )}

      {isGated && (
        <TippyTooltip {...getUpgradeTooltip(planDetails?.tooltipText, planDetails?.tooltipButtonText, handleTooltipOnClick)}>
          <GatedFeatureIcon isItemFocused={isFocused} />
        </TippyTooltip>
      )}
    </FlexApart>
  );
};

export default UpgradeLabel;
