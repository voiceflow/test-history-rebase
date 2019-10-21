import React from 'react';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';

const GroupBlockSectionLabelIcon = ({ tooltip, icon, ...props }) => (
  <Tooltip className="float-left" position="left" title={tooltip} distance={18}>
    <SvgIcon icon={icon} width={14} height={14} {...props} />
  </Tooltip>
);

export default GroupBlockSectionLabelIcon;
