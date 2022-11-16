import { Box, BoxFlex, IconButton, Link, SvgIcon, SvgIconTypes, Text, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

export interface ItemProps {
  icon: SvgIconTypes.Icon;
  title: string;
  titleTooltip?: string;
  counter?: number;
  onAdd?: VoidFunction;
  onClick?: VoidFunction;
  isActive?: boolean;
  createPlaceholder?: string;
  link?: string;
  rightText?: string;
  isMainMenu?: boolean;
}

const Item: React.FC<ItemProps> = ({ createPlaceholder, onAdd, title, titleTooltip, isActive, onClick, icon, counter, link, rightText }) => {
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
      {link && (
        <Link link={link}>
          <SvgIcon icon="editorURL" color="rgba(110, 132, 154, 0.85)" />
        </Link>
      )}
      {rightText && <Text color="rgba(110, 132, 154, 0.85)">{rightText}</Text>}
    </S.Container>
  );
};

export default Item;
