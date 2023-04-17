import React from 'react';

import { TopStepItem } from '@/pages/Project/components/StepMenu/constants';

import MenuItem from './MenuItem';
import StepSubMenu from './StepSubMenu';

interface StepMenuItemProps {
  item: TopStepItem;
  upgradePopperRef?: React.Ref<HTMLDivElement>;
  popperContainerRef?: React.Ref<HTMLDivElement>;
}

const StepMenuItem: React.FC<StepMenuItemProps> = ({ item, popperContainerRef, upgradePopperRef }) => (
  <MenuItem icon={item.smallIcon ?? item.icon} label={item.label}>
    {!!item.steps.length && <StepSubMenu ref={popperContainerRef} items={item.steps} upgradePopperRef={upgradePopperRef} />}
  </MenuItem>
);

export default React.memo(StepMenuItem);
