import { Box, BoxFlex, IconButton, SvgIcon, SvgIconTypes, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface ItemProps {
  icon: SvgIconTypes.Icon;
  title: string;
  titleTooltip?: string;
  counter?: number;
  onAdd?: VoidFunction;
  onClick: VoidFunction;
  isActive?: boolean;
  createPlaceholder?: string;
}

const Item: React.FC<ItemProps> = ({ createPlaceholder, onAdd, title, titleTooltip, isActive, onClick, icon, counter }) => {
  const withAddIcon = isActive && onAdd;

  return (
    <S.Container active={isActive} onClick={onClick}>
      <BoxFlex>
        <SvgIcon color={isActive ? '#132144' : '#6e849a'} mr={12} icon={icon} inline />
        <Box fontWeight={isActive ? 600 : undefined}>{title}</Box>
      </BoxFlex>

      {withAddIcon ? (
        <TippyTooltip title={titleTooltip || `Create ${createPlaceholder}`}>
          <IconButton size={16} icon="plus" onClick={() => onAdd()} variant={IconButton.Variant.BASIC} />
        </TippyTooltip>
      ) : (
        counter != null && (
          <Text color="#8da2b5" fontSize={13}>
            {counter}
          </Text>
        )
      )}
    </S.Container>
  );
};

export default Item;
