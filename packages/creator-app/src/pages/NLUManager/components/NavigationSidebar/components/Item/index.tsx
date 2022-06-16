import { Box, BoxFlex, IconButton, SvgIcon, SvgIconTypes, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface ItemProps {
  icon: SvgIconTypes.Icon;
  title: string;
  onAdd?: VoidFunction;
  onClick: VoidFunction;
  isActive?: boolean;
  createPlaceholder?: string;
}

const Item: React.FC<ItemProps> = ({ createPlaceholder, onAdd, title, isActive, onClick, icon }) => {
  const withAddIcon = !!isActive && !!onAdd;

  return (
    <S.Container active={isActive} onClick={onClick}>
      <BoxFlex>
        <SvgIcon color={isActive ? '#132144' : '#6e849a'} mr={12} icon={icon} inline />
        <Box fontWeight={isActive ? 600 : undefined}>{title}</Box>
      </BoxFlex>

      {withAddIcon && (
        <TippyTooltip title={`Create ${createPlaceholder}`}>
          <IconButton size={16} icon="plus" onClick={() => onAdd()} variant={IconButton.Variant.BASIC} />
        </TippyTooltip>
      )}
    </S.Container>
  );
};

export default Item;
