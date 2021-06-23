import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { stopPropagation } from '@/utils/dom';

interface OptionButtonProps {
  onToggle: () => void;
  isOpen: boolean;
  setMenuOpen: (val: boolean) => void;
}

const OptionButton: React.ForwardRefRenderFunction<HTMLButtonElement, OptionButtonProps> = ({ onToggle, isOpen, setMenuOpen }, ref) => {
  React.useEffect(() => {
    setMenuOpen(isOpen);
  }, [isOpen]);

  return <IconButton icon="elipsis" variant={IconButtonVariant.FLAT} active={isOpen} size={15} onClick={stopPropagation(onToggle)} ref={ref} />;
};

export default React.forwardRef(OptionButton);
