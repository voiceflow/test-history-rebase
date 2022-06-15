import { BoxFlex, GetOptionLabel, GetOptionValue, stopPropagation, useOnClickOutside, usePopper } from '@voiceflow/ui';
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
  planDetails?: LimitDetails | null;
}

const UpgradeOption = <T extends unknown, U extends unknown>({
  option,
  isFocused,
  searchLabel,
  getOptionLabel,
  getOptionValue,
  isGated,
  popperEnabled = false,
  planDetails,
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
  const labelRef = React.useRef<HTMLDivElement>(null);
  const [isShowingPopper, setIsShowingPopper] = useToggle();

  useOnClickOutside(labelRef, () => setIsShowingPopper(false), [isShowingPopper]);

  return (
    <BoxFlex ref={labelRef} width="100%" height="100%">
      <BoxFlex
        ref={popper.setReferenceElement}
        onClick={isGated && popperEnabled ? stopPropagation(setIsShowingPopper) : undefined}
        width="100%"
        height="100%"
      >
        <UpgradeLabel
          option={option}
          isFocused={isFocused}
          searchLabel={searchLabel}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isGated={isGated}
          planDetails={planDetails}
        />
      </BoxFlex>
      {isShowingPopper && popperEnabled && <UpgradePopper planLimits={planDetails} popperContainerRef={popperContainerRef} />}
    </BoxFlex>
  );
};

export default UpgradeOption;
