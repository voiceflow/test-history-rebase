import { PlanType } from '@voiceflow/internal';
import { Box, GetOptionLabel, GetOptionValue, stopPropagation, usePopper } from '@voiceflow/ui';
import React from 'react';

import { LimitDetails } from '@/config/planLimits';
import { useToggle } from '@/hooks';

import { UpgradeLabel, UpgradePopper } from './components';

interface UpgradeOptionProps<T, U> {
  option: T;
  isFocused?: boolean;
  searchLabel?: string | null;
  getOptionLabel: GetOptionLabel<U>;
  getOptionValue: GetOptionValue<T, U>;
  isGated?: boolean;
  popperEnabled?: boolean;
  tooltipTitle?: string;
  plan?: PlanType;
  getPlanDetails?: (option: T) => LimitDetails | undefined;
}

const UpgradeOption = <T extends unknown, U extends unknown>({
  option,
  isFocused,
  searchLabel,
  getOptionLabel,
  getOptionValue,
  isGated,
  popperEnabled = false,
  tooltipTitle,
  plan,
  getPlanDetails,
}: UpgradeOptionProps<T, U>): React.ReactElement | null => {
  const popper = usePopper({
    placement: 'right',
    strategy: 'fixed',
    modifiers: [
      { name: 'offset', options: { offset: [0, 5] } },
      { name: 'preventOverflow', options: { boundary: document.body } },
    ],
  });

  const popperContainerRef = React.useRef<HTMLDivElement>(null);
  const [isShowingPopper, setIsShowingPopper] = useToggle();

  return (
    <>
      <Box ref={popper.setReferenceElement} onClick={isGated && popperEnabled ? stopPropagation(setIsShowingPopper) : undefined} width="100%">
        <UpgradeLabel
          option={option}
          isFocused={isFocused}
          searchLabel={searchLabel}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isGated={isGated}
          tooltipTitle={tooltipTitle}
          plan={plan}
        />
      </Box>
      {isShowingPopper && popperEnabled && (
        <UpgradePopper planLimits={getPlanDetails ? getPlanDetails(option) : undefined} popperContainerRef={popperContainerRef} />
      )}
    </>
  );
};

export default UpgradeOption;
