import { Box, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';

import { AddButton } from './components';
import * as S from './styles';

export interface ItemProps {
  icon: SvgIconTypes.Icon;
  title: string;
  onClick?: VoidFunction;
  isActive?: boolean;
  children?: React.ReactNode | ((options: { isActive: boolean }) => React.ReactNode);
  style?: React.CSSProperties;
  clickable?: boolean;
}

const Item: React.FC<ItemProps> = ({ icon, title, isActive = false, clickable, onClick, children, style }) => (
  <S.Container active={isActive} onClick={onClick} style={style}>
    <Box.Flex gap={12}>
      <S.Icon icon={icon} isActive={isActive} clickable={clickable} />
      <Box fontWeight={isActive ? 600 : undefined}>{title}</Box>
    </Box.Flex>

    {typeof children === 'function' ? children({ isActive }) : children}
  </S.Container>
);

export default Object.assign(Item, {
  SubText: S.SubText,
  LinkIcon: S.LinkIcon,
  AddButton,
});
