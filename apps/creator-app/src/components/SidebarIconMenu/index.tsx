import { Nullable } from '@voiceflow/common';
import { Box, SvgIconTypes, TippyTooltip, TippyTooltipProps } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { useTheme } from '@/hooks';
import { ClassName } from '@/styles/constants';

import Drawer from '../Drawer';
import * as S from './styles';

export interface SidebarIconMenuItem {
  id?: string;
  icon?: SvgIconTypes.Icon;
  value: string;
  small?: boolean;
  status?: React.ReactNode;
  content?: React.ReactNode;
  tooltip?: TippyTooltipProps;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  withBadge?: boolean;
  divider?: boolean;
  cursor?: string;
}

export interface SidebarIconMenuProps<T extends SidebarIconMenuItem> {
  open: boolean;
  options: Nullable<T>[];
  onSelect?: (option: SidebarIconMenuItem, event: React.MouseEvent<HTMLDivElement>) => void;
  activeValue: string;
  footerOptions?: Nullable<SidebarIconMenuItem>[];
}

const SidebarIconMenu = <T extends SidebarIconMenuItem>({
  open,
  options,
  onSelect,
  activeValue,
  footerOptions,
}: SidebarIconMenuProps<T>): React.ReactElement<any, any> => {
  const theme = useTheme();

  const onClick = (option: SidebarIconMenuItem, event: React.MouseEvent<HTMLDivElement>) => {
    option.onClick?.(event);
    onSelect?.(option, event);
  };

  const renderOption = (option: Nullable<SidebarIconMenuItem>) => {
    if (option === null) return null;
    if (option.divider) return <S.Divider key={option.value} />;

    const item = (
      <S.Item
        id={option.id}
        small={option.small}
        onClick={(event) => onClick(option, event)}
        isActive={option.value === activeValue}
        className={cn(ClassName.SIDEBAR_ICON_MENU_ITEM, open && `${ClassName.SIDEBAR_ICON_MENU_ITEM}--${option.value}`)}
        cursor={option.cursor}
      >
        {option.icon && <S.Icon icon={option.icon} color="currentColor" />}

        {option.content}

        {option.status && <S.Status>{option.status}</S.Status>}

        {option.withBadge && <S.StatusBubble />}
      </S.Item>
    );

    return option.tooltip ? (
      <TippyTooltip key={option.value} placement="right" {...option.tooltip} offset={[0, -16]}>
        {item}
      </TippyTooltip>
    ) : (
      item
    );
  };

  return (
    <Drawer open={open} width={theme.components.sidebarIconMenu.width} zIndex={25} direction={Drawer.Direction.RIGHT}>
      <S.Container className={cn(ClassName.SIDEBAR_ICON_MENU, open && `${ClassName.SIDEBAR_ICON_MENU}--opened`)}>
        {options.map(renderOption)}

        {!!footerOptions?.length && (
          <>
            <Box flex={1} />
            {footerOptions.map(renderOption)}
          </>
        )}
      </S.Container>
    </Drawer>
  );
};

export default SidebarIconMenu;
