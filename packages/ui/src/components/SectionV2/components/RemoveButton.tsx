import IconButton, { IconButtonVariant } from '@ui/components/IconButton';
import React from 'react';

export interface RemoveButtonProps {
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  disabled?: boolean;
}

const RemoveButton: React.OldFC<RemoveButtonProps> = ({ onClick, isActive, style, disabled }) => (
  <IconButton size={16} icon="minus" onClick={onClick} variant={IconButtonVariant.BASIC} activeClick={isActive} style={style} disabled={disabled} />
);

export default RemoveButton;
