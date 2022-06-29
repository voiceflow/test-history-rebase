import { Nullable } from '@voiceflow/common';
import { Box, SvgIconTypes, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { useTheme } from '@/hooks';
import { ClassName } from '@/styles/constants';

import Drawer from '../Drawer';
import { Container, IconContainer, Item, StatusBubble } from './components';

export interface SidebarIconMenuItem {
  id?: string;
  icon: SvgIconTypes.Icon;
  value: string;
  small?: boolean;
  tooltip?: TippyTooltipProps;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  withBadge?: boolean;
}

export interface SidebarIconMenuProps<T extends SidebarIconMenuItem> {
  open: boolean;
  options: Nullable<T>[];
  onSelect?: (option: T, event: React.MouseEvent<HTMLDivElement>) => void;
  activeValue: string;
  footerOptions?: Nullable<T>[];
}

const SidebarIconMenu = <T extends SidebarIconMenuItem>({
  open,
  options,
  onSelect,
  activeValue,
  footerOptions,
}: SidebarIconMenuProps<T>): React.ReactElement<any, any> => {
  const theme = useTheme();

  const onClick = (option: T, event: React.MouseEvent<HTMLDivElement>) => {
    option.onClick?.(event);
    onSelect?.(option, event);
  };

  const renderOption = (option: Nullable<T>) => {
    if (option === null) return null;
    return (
      <TippyTooltip key={option.value} disabled={!option.tooltip} position="right" {...option.tooltip}>
        <Item
          id={option.id}
          small={option.small}
          onClick={(event) => onClick(option, event)}
          isActive={option.value === activeValue}
          className={cn(ClassName.SIDEBAR_ICON_MENU_ITEM, open && `${ClassName.SIDEBAR_ICON_MENU_ITEM}--${option.value}`)}
        >
          <span>
            <IconContainer icon={option.icon} color="currentColor" />
          </span>
          {option.withBadge && <StatusBubble />}
        </Item>
      </TippyTooltip>
    );
  };

  return (
    <Drawer open={open} width={theme.components.sidebarIconMenu.width} zIndex={25} direction={Drawer.Direction.RIGHT}>
      <Container className={cn(ClassName.SIDEBAR_ICON_MENU, open && `${ClassName.SIDEBAR_ICON_MENU}--opened`)}>
        {options.map(renderOption)}

        {!!footerOptions?.length && (
          <>
            <Box flex={1} />
            {footerOptions.map(renderOption)}
          </>
        )}
      </Container>
    </Drawer>
  );
};

export default SidebarIconMenu;
