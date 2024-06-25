import SvgIcon from '@ui/components/SvgIcon';
import type { TippyTooltipProps } from '@ui/components/TippyTooltip';
import TippyTooltip from '@ui/components/TippyTooltip';
import React from 'react';

const RowWarningTooltip: React.FC<Omit<TippyTooltipProps, 'content'>> = ({ children, ...props }) => (
  <TippyTooltip {...props} content={children}>
    <SvgIcon icon="warning" color="#BD425F" clickable />
  </TippyTooltip>
);

export default RowWarningTooltip;
