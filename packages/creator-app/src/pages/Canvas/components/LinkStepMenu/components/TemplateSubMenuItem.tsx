import { BaseModels } from '@voiceflow/base-types';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { getSingleBlockTemplatePortID } from '../utils';
import { useOnCreate } from './hooks';
import SubMenuItem from './SubMenuItem';

interface TemplateSubMenuItemProps {
  item: BaseModels.Version.CanvasTemplate;
}

const TemplateSubMenuItem: React.FC<TemplateSubMenuItemProps> = ({ item }) => {
  const onClick = useOnCreate(async ({ coords, engine, stepMenu }) => {
    const nodes = await engine.canvasTemplate.dropTemplate(item.id, coords);
    const portID = getSingleBlockTemplatePortID(nodes);

    if (portID) {
      await engine.linkCreation.complete(portID);
    }

    stepMenu.onHide();
  });

  return <SubMenuItem onClick={stopPropagation(onClick)} label={item.name} isLibrary />;
};

export default React.memo(TemplateSubMenuItem);
