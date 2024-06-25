import * as Realtime from '@voiceflow/realtime-sdk';
import type { SvgIconTypes } from '@voiceflow/ui';
import { stopPropagation, usePopper } from '@voiceflow/ui';
import React from 'react';

import { StepMenuType } from '@/constants';

import { useOnCreate } from './hooks';
import SubMenuItem from './SubMenuItem';

export interface StepSubItem {
  type: Realtime.BlockType;
  icon: SvgIconTypes.Icon;
  label: string;
  factoryData?: Realtime.NodeData<any>;
  tooltipLink?: string;
}

interface StepSubMenuItemProps {
  item: StepSubItem;
}

const StepSubMenuItem: React.FC<StepSubMenuItemProps> = ({ item }) => {
  const popper = usePopper({ strategy: 'fixed', placement: 'right' });

  const onClick = useOnCreate(async ({ coords, engine, stepMenu }) => {
    const nodeID = await engine.node.add({
      type: item.type,
      coords,
      menuType: StepMenuType.LINK,
      factoryData: item.factoryData,
    });

    const portID = Realtime.Utils.port.getInPortID(nodeID);

    await engine.linkCreation.complete(portID);

    stepMenu.onHide();

    await engine.setActive(nodeID);
  });

  return (
    <SubMenuItem
      ref={popper.setReferenceElement}
      icon={item.icon}
      label={item.label}
      onClick={stopPropagation(onClick)}
      iconProps={{ color: '#132144' }}
    />
  );
};

export default React.memo(StepSubMenuItem);
