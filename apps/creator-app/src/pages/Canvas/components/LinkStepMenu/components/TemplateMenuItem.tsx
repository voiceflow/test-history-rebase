import React from 'react';

import type { TopLibraryItem } from '@/pages/Project/components/StepMenu/constants';

import MenuItem from './MenuItem';
import TemplateSubMenu from './TemplateSubMenu';

interface TemplateMenuItemProps {
  item: TopLibraryItem;
  popperContainerRef?: React.Ref<HTMLDivElement>;
}

const TemplateMenuItem: React.FC<TemplateMenuItemProps> = ({ item, popperContainerRef }) => (
  <MenuItem icon={item.smallIcon ?? item.icon} label={item.label}>
    {!!item.librarySections.templates.length && (
      <TemplateSubMenu ref={popperContainerRef} items={item.librarySections.templates} />
    )}
  </MenuItem>
);

export default React.memo(TemplateMenuItem);
