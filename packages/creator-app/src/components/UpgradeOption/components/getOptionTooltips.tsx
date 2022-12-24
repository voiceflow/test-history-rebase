import { TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

export const getLabelTooltip = (header: string | undefined, body: string | undefined, isGated = false): TippyTooltipProps => ({
  html: (
    <TippyTooltip.Complex title={header} width={200}>
      {body}
    </TippyTooltip.Complex>
  ),
  style: { display: 'block', width: '100%' },
  position: 'right',
  distance: isGated ? 50 : 10,
  bodyOverflow: true,
});

export const getUpgradeTooltip = (
  text: string | undefined | JSX.Element,
  buttonText: string | undefined,
  onClick: VoidFunction
): TippyTooltipProps => ({
  position: 'right',
  interactive: true,
  style: { display: 'block' },
  bodyOverflow: true,
  distance: 34,
  html: (
    <TippyTooltip.FooterButton buttonText={buttonText || ''} width={200} onClick={onClick}>
      {text}
    </TippyTooltip.FooterButton>
  ),
});
