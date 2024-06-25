import type { SvgIconTypes } from '@voiceflow/ui';
import { Box, Menu, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { useHover } from '@/hooks';
import { ClassName } from '@/styles/constants';

interface MenuItemProps extends React.PropsWithChildren {
  icon?: SvgIconTypes.Icon;
  label: React.ReactNode;
}

const MenuItemProps: React.FC<MenuItemProps> = ({ icon, label, children }) => {
  const [isHovered, , hoverHandlers] = useHover();

  return (
    <div {...hoverHandlers} className={ClassName.STEP_MENU_ITEM}>
      <Menu.Item active={isHovered}>
        <Box.Flex>
          {icon && <SvgIcon icon={icon} size={16} pt={2} mr={16} />}
          <Text>{label}</Text>
        </Box.Flex>

        <Menu.ItemNextIcon />
      </Menu.Item>

      {isHovered && children}
    </div>
  );
};

export default MenuItemProps;
