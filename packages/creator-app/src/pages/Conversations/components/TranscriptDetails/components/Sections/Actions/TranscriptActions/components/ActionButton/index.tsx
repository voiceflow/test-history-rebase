import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';

import { ActionContainer, ActionIcon, ActionLabel } from './components';

interface StyledActionProps {
  label: string;
  icon: Icon;
  onClick: () => void;
  color?: string;
  left?: number;
  selected?: boolean;
}

const ActionButton = ({ label, left, icon, color, onClick, selected }: StyledActionProps) => {
  return (
    <>
      <ActionContainer selected={selected} onClick={onClick}>
        <ActionLabel>{label}</ActionLabel>
        <ActionIcon selected={selected} left={left}>
          <SvgIcon color={color} icon={icon}></SvgIcon>
        </ActionIcon>
      </ActionContainer>
    </>
  );
};

export default ActionButton;
