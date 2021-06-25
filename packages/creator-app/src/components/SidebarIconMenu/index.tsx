import { Box, Icon, SvgIcon, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import React from 'react';

import { useTheme } from '@/hooks';
import { SlideOutDirection } from '@/styles/transitions';

import Drawer from '../Drawer';
import { Container, Item } from './components';

export interface SidebarIconMenuItem {
  id?: string;
  icon: Icon;
  value: string;
  small?: boolean;
  tooltip?: TippyTooltipProps;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface SidebarIconMenuProps<T extends SidebarIconMenuItem> {
  open: boolean;
  options: T[];
  onSelect?: (option: T, event: React.MouseEvent<HTMLDivElement>) => void;
  activeValue: string;
  footerOptions?: T[];
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

  const renderOption = (option: T) => {
    const ItemContainer = option.tooltip ? TippyTooltip : React.Fragment;

    return (
      <ItemContainer key={option.value} {...option.tooltip} {...(option.tooltip ? { position: option.tooltip.position ?? 'right' } : {})}>
        <Item id={option.id} small={option.small} isActive={option.value === activeValue} onClick={(event) => onClick(option, event)}>
          <SvgIcon icon={option.icon} color="currentColor" />
        </Item>
      </ItemContainer>
    );
  };

  return (
    <Drawer as="section" open={open} width={theme.components.sidebarIconMenu.width} zIndex={25} direction={SlideOutDirection.RIGHT}>
      <Container>
        {options.map(renderOption)}

        {footerOptions?.length && (
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
