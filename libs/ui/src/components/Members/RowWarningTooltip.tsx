import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import type { TippyTooltipProps } from '@/components/TippyTooltip';
import TippyTooltip from '@/components/TippyTooltip';

const RowWarningTooltip: React.FC<Omit<TippyTooltipProps, 'content'>> = ({ children, ...props }) => (
  <TippyTooltip {...props} content={children}>
    <SvgIcon icon="warning" color="#BD425F" clickable />
  </TippyTooltip>
);

export default RowWarningTooltip;
