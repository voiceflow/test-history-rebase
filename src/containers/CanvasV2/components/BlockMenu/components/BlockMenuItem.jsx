import React from 'react';
import { useDrag } from 'react-dnd';
import { Tooltip } from 'react-tippy';

import SvgIcon from '@/components/SvgIcon';
import { DragItem } from '@/constants';
import { NODE_MANAGERS } from '@/containers/CanvasV2/managers';
import { activePlatformSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

import BlockMenuItemCard from './BlockMenuItemCard';
import MenuTooltipContainer from './MenuTooltipContainer';

const BlockMenuItem = ({ value, platform }) => {
  const { icon, platforms, tip } = NODE_MANAGERS[value.type];
  const isEnabled = !platforms || platforms.includes(platform);
  const [, dragRef] = useDrag({
    item: { type: DragItem.BLOCK_MENU, blockType: value.type },
    collect: () => ({}),
  });

  return (
    <BlockMenuItemCard isEnabled={isEnabled} ref={dragRef}>
      <SvgIcon icon={icon} />
      {value.label}
      <MenuTooltipContainer>
        <Tooltip distance={10} title={tip} position="bottom" theme="menu">
          <SvgIcon icon="info" size={15} />
        </Tooltip>
      </MenuTooltipContainer>
    </BlockMenuItemCard>
  );
};

const mapStateToProps = {
  platform: activePlatformSelector,
};

export default connect(mapStateToProps)(BlockMenuItem);
