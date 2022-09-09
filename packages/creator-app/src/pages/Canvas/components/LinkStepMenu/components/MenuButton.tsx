import { Box, Menu, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useHover } from '@/hooks';
import { TopLibraryItem, TopStepItem } from '@/pages/Project/components/StepMenu/constants';
import { ClassName } from '@/styles/constants';

import SubMenu from './SubMenu';

interface MenuButtonItem {
  step: TopStepItem | TopLibraryItem;
  popperContainerRef?: React.Ref<HTMLDivElement>;
  upgradePopperRef?: React.Ref<HTMLDivElement>;
}

const MenuButton: React.FC<MenuButtonItem> = ({ step, popperContainerRef, upgradePopperRef }) => {
  const [isHovered, , hoverHandlers] = useHover();

  return (
    <div {...hoverHandlers} className={ClassName.STEP_MENU_ITEM}>
      <Menu.Item active={isHovered}>
        <Box.Flex>
          <SvgIcon icon={step.smallIcon ? step.smallIcon : step.icon} size={16} style={{ paddingTop: '2px' }} />
          <Text paddingLeft="16px">{step.label}</Text>
        </Box.Flex>

        <Menu.ItemNextIcon />
      </Menu.Item>

      {step.steps &&
        isHovered &&
        (step.isLibrary ? (
          <SubMenu templates={step.steps} popperContainerRef={popperContainerRef} />
        ) : (
          <SubMenu steps={step.steps} popperContainerRef={popperContainerRef} upgradePopperRef={upgradePopperRef} />
        ))}
    </div>
  );
};

export default MenuButton;
