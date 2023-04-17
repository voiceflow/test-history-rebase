import SvgIcon from '@ui/components/SvgIcon';
import React from 'react';

import Status from './Status';

export interface CollapseArrowIconProps {
  collapsed: boolean;
}

const CollapseArrowIcon: React.FC<CollapseArrowIconProps> = ({ collapsed }) => (
  <Status color={Status.Color.SECONDARY}>
    <SvgIcon icon="arrowToggle" size={10} inline rotation={collapsed ? 0 : 180} />
  </Status>
);

export default CollapseArrowIcon;
