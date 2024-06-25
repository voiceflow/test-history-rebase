import type { SvgIconTypes } from '@voiceflow/ui';
import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { ActionContainer, ActionIcon, ActionLabel } from './components';

interface StyledActionProps {
  id: string;
  icon: SvgIconTypes.Icon;
  left?: number;
  label: string;
  color?: string;
  onClick: () => void;
  selected?: boolean;
}

const ActionButton: React.FC<StyledActionProps> = ({ id, label, left, icon, color, onClick, selected }) => (
  <ActionContainer id={id} selected={selected} onClick={onClick}>
    <ActionLabel>{label}</ActionLabel>

    <ActionIcon selected={selected} left={left}>
      <SvgIcon color={color} icon={icon}></SvgIcon>
    </ActionIcon>
  </ActionContainer>
);

export default ActionButton;
