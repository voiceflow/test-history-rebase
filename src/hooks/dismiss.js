import React from 'react';

import { useEnableDisable } from './toggle';

// eslint-disable-next-line import/prefer-default-export
export function useDismissable(defaultValue = false, onClose) {
  const [isOpen, setOpen, setClose] = useEnableDisable(defaultValue);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }

    setClose();
  };

  const onToggle = isOpen ? handleClose : setOpen;
  const removeRootListener = () => document.removeEventListener('click', handleClose);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClose);

      return removeRootListener;
    }

    removeRootListener();
  }, [isOpen]);

  return [isOpen, onToggle];
}
