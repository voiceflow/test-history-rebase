import React from 'react';

import SvgIcon, { Icon } from '@/components/SvgIcon';

import { ActionContainer, ActionIcon, ActionLabel } from './components';

interface StyledActionProps {
  label: string;
  icon: Icon;
  onClick: () => void;
}

const ActionButton = ({ label, icon, onClick }: StyledActionProps) => {
  return (
    <>
      <ActionContainer onClick={onClick}>
        <ActionLabel>{label}</ActionLabel>
        <ActionIcon>
          <SvgIcon icon={icon}></SvgIcon>
        </ActionIcon>
      </ActionContainer>
    </>
  );
};

export default ActionButton;
