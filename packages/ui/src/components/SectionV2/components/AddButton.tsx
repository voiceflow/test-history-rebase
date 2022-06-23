import IconButton, { IconButtonVariant } from '@ui/components/IconButton';
import React from 'react';

export interface AddButtonProps {
  onClick?: VoidFunction;
  isActive?: boolean;
  disabled?: boolean;
}

const AddButton: React.ForwardRefRenderFunction<HTMLButtonElement, AddButtonProps> = ({ onClick, isActive, disabled }, ref) => (
  <IconButton
    ref={ref}
    size={16}
    icon="plus"
    onClick={onClick}
    variant={IconButtonVariant.BASIC}
    disabled={disabled}
    activeClick={isActive}
    style={{ borderRadius: '50%' }}
  />
);

export default React.forwardRef(AddButton);
