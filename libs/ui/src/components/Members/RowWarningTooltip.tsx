import SvgIcon from '@ui/components/SvgIcon';
import TippyTooltip, { TippyTooltipProps } from '@ui/components/TippyTooltip';
import React from 'react';

const RowWarningTooltip: React.FC<Omit<TippyTooltipProps, 'content'>> = ({ children, ...props }) => (
  <TippyTooltip {...props} content={children}>
    <SvgIcon icon="warning" color="#BD425F" clickable />
  </TippyTooltip>
);

export default RowWarningTooltip;
