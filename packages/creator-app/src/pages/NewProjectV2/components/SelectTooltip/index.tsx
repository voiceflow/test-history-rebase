import { TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

const getSelectTooltip = (header: string, body: string): TippyTooltipProps => ({
  html: (
    <TippyTooltip.Complex title={header} width={200}>
      {body}
    </TippyTooltip.Complex>
  ),
  style: { display: 'block' },
  position: 'right',
  bodyOverflow: true,
});

export default getSelectTooltip;
