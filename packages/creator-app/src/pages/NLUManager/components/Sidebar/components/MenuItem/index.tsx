import { Box, BoxFlex, Icon, IconButtonVariant, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { AddButton, Container } from './components';

interface ItemProps {
  title: string;
  icon: Icon;
  onAdd?: () => void;
  onClick: () => void;
  isActive?: boolean;
  createPlaceholder?: string;
}

const ACTIVE_ICON_COLOR = '#132144';
const INACTIVE_ICON_COLOR = '#6e849a';

const Item: React.FC<ItemProps> = ({ createPlaceholder, onAdd, title, isActive, onClick, icon }) => {
  const showAddIcon = !!isActive && !!onAdd;
  const ButtonWrapper = showAddIcon ? TippyTooltip : React.Fragment;
  const buttonWrapperProps = showAddIcon ? { title: `Create ${createPlaceholder}` } : {};
  return (
    <Container active={isActive} onClick={onClick}>
      <BoxFlex>
        <SvgIcon color={isActive ? ACTIVE_ICON_COLOR : INACTIVE_ICON_COLOR} mr={12} icon={icon} inline />
        <Box fontWeight={isActive ? 600 : undefined}>{title}</Box>
      </BoxFlex>
      <ButtonWrapper {...buttonWrapperProps}>
        <AddButton isVisible={showAddIcon} onClick={onAdd} variant={IconButtonVariant.BASIC} icon="plus" />
      </ButtonWrapper>
    </Container>
  );
};

export default Item;
