import { TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

export interface Props {
  live: boolean;
  offset?: TippyTooltipProps['offset'];
  children: React.ReactNode;
  position?: TippyTooltipProps['placement'];
}

const LiveToggleTooltip: React.FC<Props> = ({ live, children, offset, position }) => (
  <TippyTooltip
    tag="div"
    width={232}
    content={
      <TippyTooltip.FooterButton
        title={live ? 'Live' : 'Draft'}
        onClick={onOpenInternalURLInANewTabFactory(Documentation.DOMAINS_LIVE_TOGGLE)}
        buttonText="More"
      >
        {live
          ? 'When toggled on, this domain is accessible during tests, and to customers if the assistant is in production.'
          : 'When toggled off, this domains content is hidden during tests, or to customers if the assistant is in production.'}
      </TippyTooltip.FooterButton>
    }
    delay={[500, 0]}
    offset={offset}
    placement={position}
    interactive
  >
    {children}
  </TippyTooltip>
);

export default LiveToggleTooltip;
