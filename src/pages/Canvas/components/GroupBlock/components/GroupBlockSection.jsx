import React from 'react';

import { FlexCenter } from '@/componentsV2/Flex';

import GroupBlockSectionIcon from './GroupBlockSectionIcon';
import GroupBlockSectionLabel from './GroupBlockSectionLabel';

const GroupBlockSection = ({ label, icon, tooltip, children, ...props }, ref) => (
  <FlexCenter column fullWidth {...props} ref={ref}>
    <GroupBlockSectionLabel>
      {icon && <GroupBlockSectionIcon icon={icon} tooltip={tooltip} />}
      {label}
    </GroupBlockSectionLabel>
    {children}
  </FlexCenter>
);

export default React.forwardRef(GroupBlockSection);
