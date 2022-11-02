import { Box, GetOptionLabel, GetOptionValue, useOnClickOutside, usePopper } from '@voiceflow/ui';
import React from 'react';

import { LimitDetails } from '@/config/planLimits';
import { UpgradePrompt } from '@/ducks/tracking';
import { useToggle, useTrackingEvents } from '@/hooks';

import { UpgradeLabel, UpgradePopper } from './components';

export { getLabelTooltip, getUpgradeTooltip } from './components';

interface UpgradeOptionProps<T, U> {
  option: T & { disabled?: boolean };
  isFocused?: boolean;
  searchLabel?: string | null;
  getOptionLabel: GetOptionLabel<U>;
  getOptionValue: GetOptionValue<T, U>;
  isGated?: boolean;
  popperEnabled?: boolean;
  planDetails?: LimitDetails | null;
  promptOrigin: UpgradePrompt;
}

/**
 * @deprecated use PlanPermittedMenuItem instead
 * @returns
 */
const UpgradeOption = <T extends unknown, U extends unknown>({
  option,
  isFocused,
  searchLabel,
  getOptionLabel,
  getOptionValue,
  isGated,
  popperEnabled = false,
  planDetails,
  promptOrigin,
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
  const [trackingEvents] = useTrackingEvents();

  React.useEffect(() => {
    if (!isShowingPopper) return;

    trackingEvents.trackUpgradePrompt({ promptType: promptOrigin });
  }, [isShowingPopper]);

  const handleLabelClick = (e: React.MouseEvent) => {
    if (option.disabled) {
      e.stopPropagation();
    }
    if (isGated && popperEnabled) {
      e.stopPropagation();
      setIsShowingPopper();
    }
  };

  useOnClickOutside([labelRef, popperContainerRef], () => setIsShowingPopper(false), [isShowingPopper]);

  return (
    <Box.Flex ref={labelRef} width="100%" height="100%">
      <Box.Flex ref={popper.setReferenceElement} onClick={handleLabelClick} width="100%" height="100%">
        <UpgradeLabel
          option={option}
          isFocused={isFocused}
          searchLabel={searchLabel}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isGated={isGated}
          planDetails={planDetails}
        />
      </Box.Flex>

      {isShowingPopper && popperEnabled && (
        <UpgradePopper planLimits={planDetails} popperContainerRef={popperContainerRef} promptOrigin={promptOrigin} />
      )}
    </Box.Flex>
  );
};

export default UpgradeOption;
