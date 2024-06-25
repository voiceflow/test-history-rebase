import React from 'react';

import type { TopStepItem } from '@/pages/Project/components/StepMenu/constants';

import MenuItem from './MenuItem';
import StepSubMenu from './StepSubMenu';

interface StepMenuItemProps {
  item: TopStepItem;
  popperContainerRef?: React.Ref<HTMLDivElement>;
}

const StepMenuItem: React.FC<StepMenuItemProps> = ({ item, popperContainerRef }) => (
  <MenuItem icon={item.smallIcon ?? item.icon} label={item.label}>
    {!!item.steps.length && <StepSubMenu ref={popperContainerRef} items={item.steps} />}
  </MenuItem>
);

export default React.memo(StepMenuItem);
