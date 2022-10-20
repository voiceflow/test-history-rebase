import { BaseModels } from '@voiceflow/base-types';
import React from 'react';

import SubMenu from './SubMenu';
import TemplateSubMenuItem from './TemplateSubMenuItem';

interface TemplateSubMenuProps {
  items: BaseModels.Version.CanvasTemplate[];
}

const TemplateSubMenu = React.forwardRef<HTMLDivElement, TemplateSubMenuProps>(({ items }, ref) => {
  const processedItems = React.useMemo(
    () =>
      [...items]?.sort((l, r) => {
        if (l.name > r.name) return 1;
        if (l.name < r.name) return -1;

        return 0;
      }),
    [items]
  );

  return (
    <SubMenu ref={ref}>
      {processedItems.map((item) => (
        <TemplateSubMenuItem key={item.id} item={item} />
      ))}
    </SubMenu>
  );
});

export default TemplateSubMenu;
