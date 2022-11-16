import { Button, ButtonVariant, PrimaryButtonProps, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import * as VariableState from '@/ducks/variableState';
import { styled } from '@/hocs';
import { useDispatch, useTrackingEvents } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { Identifier } from '@/styles/constants';

const RunButton = styled(Button)<PrimaryButtonProps>`
  svg {
    transform: scale(1.15);
  }
`;

const Run: React.FC<{ variant?: ButtonVariant }> = ({ variant = ButtonVariant.PRIMARY }) => {
  const goToPrototype = useDispatch(Router.goToCurrentPrototype);
  const defaultVariableState = useDispatch(VariableState.defaultVariableState);

  const [, trackingEventsWrapper] = useTrackingEvents();

  const run = React.useCallback(
    trackingEventsWrapper(() => {
      defaultVariableState();
      goToPrototype();
    }, 'trackActiveProjectPrototypeTestClick'),
    []
  );

  const iconProps: React.ComponentProps<typeof SvgIcon> =
    variant === ButtonVariant.SECONDARY ? { icon: 'playOutline', color: '#6E849AD9' } : { icon: 'play' };

  return (
    <TippyTooltip title="Run" hotkey={HOTKEY_LABEL_MAP[Hotkey.RUN_MODE]}>
      <RunButton flat squareRadius onClick={run} id={Identifier.TEST} variant={variant}>
        <SvgIcon width={16} height={16} {...iconProps} />
      </RunButton>
    </TippyTooltip>
  );
};

export default Run;
