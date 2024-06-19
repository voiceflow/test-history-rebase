import React from 'react';

import { useCanvasNodeFilter } from '@/hooks/canvas-node.hook';
import { getManager } from '@/pages/Canvas/managers/utils';
import { StepItem } from '@/pages/Project/components/StepMenu/constants';

import StepSubMenuItem, { StepSubItem } from './StepSubMenuItem';
import SubMenu from './SubMenu';

interface StepSubMenuProps {
  items: StepItem[];
}

const StepSubMenu = React.forwardRef<HTMLDivElement, StepSubMenuProps>(({ items }, ref) => {
  const nodeFilter = useCanvasNodeFilter();

  const processedItems = React.useMemo(
    () =>
      items.filter(nodeFilter).map<StepSubItem>((item) => {
        const manager = getManager(item.type, true);

        return {
          ...item,
          icon: item.getIcon(manager),
          label: item.getLabel(manager) ?? '',
          tooltipText: item.getStepTooltipText(manager),
          tooltipLink: item.getStepTooltipLink(manager),
        };
      }) ?? [],
    [items, nodeFilter]
  );

  return (
    <SubMenu ref={ref}>
      {processedItems.map((item) => (
        <StepSubMenuItem key={item.label} item={item} />
      ))}
    </SubMenu>
  );
});

export default StepSubMenu;
