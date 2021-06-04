import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';

import { ActionContainer, ActionIcon, ActionLabel } from './components';

interface StyledActionProps {
  label: string;
  icon: Icon;
  onClick: () => void;
  color?: string;
  left?: number;
}

const ActionButton = ({ label, left, icon, color, onClick }: StyledActionProps) => {
  return (
    <>
      <ActionContainer onClick={onClick}>
        <ActionLabel>{label}</ActionLabel>
        <ActionIcon left={left}>
          <SvgIcon color={color} icon={icon}></SvgIcon>
        </ActionIcon>
      </ActionContainer>
    </>
  );
};

export default ActionButton;
