import IconButton, { IconButtonVariant } from '@ui/components/IconButton';
import React from 'react';

export interface RemoveButtonProps {
  onClick?: VoidFunction;
  isActive?: boolean;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({ onClick, isActive }) => (
  <IconButton size={16} icon="minus" onClick={onClick} variant={IconButtonVariant.BASIC} activeClick={isActive} style={{ borderRadius: '50%' }} />
);

export default RemoveButton;
