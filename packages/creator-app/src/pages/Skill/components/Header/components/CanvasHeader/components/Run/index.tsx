import { Button, ButtonVariant, PrimaryButtonProps, SvgIcon, SvgIconContainer, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { styled } from '@/hocs';
import { useDispatch, useTrackingEvents } from '@/hooks';
import { Hotkey, HOTKEY_LABEL_MAP } from '@/keymap';
import { Identifier } from '@/styles/constants';

const RunButton = styled(Button)<PrimaryButtonProps>`
  ${SvgIconContainer} {
    position: relative;
    left: 1px;
  }
`;

const Run: React.FC = () => {
  const goToPrototype = useDispatch(Router.goToCurrentPrototype);

  const [, trackingEventsWrapper] = useTrackingEvents();

  return (
    <TippyTooltip title="Run" hotkey={HOTKEY_LABEL_MAP[Hotkey.RUN_MODE]} style={{ marginRight: '16px' }}>
      <RunButton
        squareRadius
        onClick={trackingEventsWrapper(() => goToPrototype(), 'trackActiveProjectPrototypeTestClick')}
        id={Identifier.TEST}
        variant={ButtonVariant.PRIMARY}
      >
        <SvgIcon icon="play" width={14} height={18} />
      </RunButton>
    </TippyTooltip>
  );
};

export default Run;
