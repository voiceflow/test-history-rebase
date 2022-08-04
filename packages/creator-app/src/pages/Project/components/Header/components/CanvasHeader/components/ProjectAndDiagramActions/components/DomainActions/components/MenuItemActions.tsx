import { Box, Divider, Menu as UIMenu, Toggle } from '@voiceflow/ui';
import React from 'react';

interface MenuItemActionsProps {
  id: string;
  isHome?: boolean;
}

const MenuItemActions: React.FC<MenuItemActionsProps> = ({ isHome }) => {
  return (
    <UIMenu width={177} noBottomPadding>
      <UIMenu.Item>Rename</UIMenu.Item>
      <UIMenu.Item>Duplicate</UIMenu.Item>

      {!isHome && (
        <>
          <Divider offset={8} isSecondaryColor />
          <UIMenu.Item>Delete</UIMenu.Item>
        </>
      )}

      <Divider offset={[8, 0]} isSecondaryColor />
      <UIMenu.Item disabled={isHome} ending>
        <Box mr="auto">Is live</Box>
        <Toggle size={Toggle.Size.EXTRA_SMALL} />
      </UIMenu.Item>
    </UIMenu>
  );
};

export default MenuItemActions;
