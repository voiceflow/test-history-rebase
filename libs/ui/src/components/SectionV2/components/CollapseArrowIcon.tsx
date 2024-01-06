import Box from '@ui/components/Box';
import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';

import Status from './Status';

export interface CollapseArrowIconProps {
  collapsed: boolean;
}

const CollapseArrowIcon: React.FC<CollapseArrowIconProps> = ({ collapsed }) => (
  <Box.FlexCenter color={Status.Color.SECONDARY} size={16}>
    <SvgIcon icon="arrowToggle" size={10} inline rotation={collapsed ? 0 : 180} />
  </Box.FlexCenter>
);

export default CollapseArrowIcon;
