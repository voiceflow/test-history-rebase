import { Icon, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { ActionContainer, ActionIcon, ActionLabel } from './components';

interface StyledActionProps {
  id: string;
  label: string;
  icon: Icon;
  onClick: () => void;
  color?: string;
  left?: number;
  selected?: boolean;
}

const ActionButton = ({ id, label, left, icon, color, onClick, selected }: StyledActionProps) => {
  return (
    <>
      <ActionContainer id={id} selected={selected} onClick={onClick}>
        <ActionLabel>{label}</ActionLabel>
        <ActionIcon selected={selected} left={left}>
          <SvgIcon color={color} icon={icon}></SvgIcon>
        </ActionIcon>
      </ActionContainer>
    </>
  );
};

export default ActionButton;
