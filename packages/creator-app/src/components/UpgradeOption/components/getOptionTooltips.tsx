import { TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

export const getLabelTooltip = (header: string | undefined, body: string | undefined, isGated = false): TippyTooltipProps => ({
  width: 232,
  style: { display: 'block', width: '100%' },
  offset: [0, isGated ? 50 : 10],
  content: <TippyTooltip.Complex title={header}>{body}</TippyTooltip.Complex>,
  position: 'right',
});

export const getUpgradeTooltip = (text: React.ReactNode, buttonText: string | undefined, onClick: VoidFunction): TippyTooltipProps => ({
  width: 232,
  style: { display: 'block' },
  offset: [0, 34],
  position: 'right',
  interactive: true,
  content: (
    <TippyTooltip.FooterButton buttonText={buttonText || ''} onClick={onClick}>
      {text}
    </TippyTooltip.FooterButton>
  ),
});
