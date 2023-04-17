import { Box, Menu, SvgIcon, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import { ClassName } from '@/styles/constants';

import SubMenuItemLabel from './SubMenuItemLabel';

interface SubMenuItemProps {
  icon?: SvgIconTypes.Icon;
  label: React.ReactNode;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  children?: React.ReactNode;
  isLibrary?: boolean;
  iconProps?: Omit<SvgIconTypes.Props, 'icon'>;
  onMouseEnter?: React.MouseEventHandler;
  onMouseLeave?: React.MouseEventHandler;
}

const SubMenuItem = React.forwardRef<HTMLLIElement, SubMenuItemProps>(
  ({ icon, label, children, iconProps, disabled, isLibrary, ...itemProps }, ref) => (
    <Menu.Item ref={ref} className={ClassName.SUB_STEP_MENU_ITEM} disabled={disabled} {...itemProps}>
      <Box.FlexStart width="100%">
        {icon && <SvgIcon icon={icon} size={16} {...iconProps} />}

        <SubMenuItemLabel disabled={disabled} isLibrary={isLibrary}>
          {label}
        </SubMenuItemLabel>
      </Box.FlexStart>

      {children}
    </Menu.Item>
  )
);

export default SubMenuItem;
