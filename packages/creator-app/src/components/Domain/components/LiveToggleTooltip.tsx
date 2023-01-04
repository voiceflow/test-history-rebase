import { TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export interface Props {
  live: boolean;
  children: React.ReactNode;
  distance?: number;
  position?: TippyTooltipProps['position'];
}

const LiveToggleTooltip: React.FC<Props> = ({ live, children, distance, position }) => (
  <TippyTooltip
    tag="div"
    html={
      <TippyTooltip.FooterButton
        title={live ? 'Live' : 'Draft'}
        buttonText="More"
        onClick={onOpenInternalURLInANewTabFactory(Documentation.DOMAINS_LIVE_TOGGLE)}
      >
        {live
          ? 'When toggled on, this domain is accessible during tests, and to customers if the assistant is in production.'
          : 'When toggled off, this domains content is hidden during tests, or to customers if the assistant is in production.'}
      </TippyTooltip.FooterButton>
    }
    delay={[500, 0]}
    distance={distance}
    position={position}
    interactive
    bodyOverflow
  >
    {children}
  </TippyTooltip>
);

export default LiveToggleTooltip;
