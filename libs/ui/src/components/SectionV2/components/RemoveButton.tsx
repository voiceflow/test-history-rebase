import * as System from '@ui/system';
import React from 'react';

export interface RemoveButtonProps {
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  disabled?: boolean;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({ onClick, isActive, style, disabled }) => (
  <System.IconButtonsGroup.Base>
    <System.IconButton.Base icon="minus" onClick={onClick} active={isActive} style={style} disabled={disabled} />
  </System.IconButtonsGroup.Base>
);

export default RemoveButton;
