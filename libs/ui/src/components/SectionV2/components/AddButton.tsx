import * as System from '@ui/system';
import React from 'react';

export interface AddButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  disabled?: boolean;
}

const AddButton: React.ForwardRefRenderFunction<HTMLButtonElement, AddButtonProps> = (
  { onClick, isActive, disabled },
  ref
) => (
  <System.IconButtonsGroup.Base>
    <System.IconButton.Base ref={ref} icon="plus" active={isActive} onClick={onClick} disabled={disabled} />
  </System.IconButtonsGroup.Base>
);

export default React.forwardRef(AddButton);
