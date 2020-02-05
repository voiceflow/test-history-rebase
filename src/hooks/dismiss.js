import React from 'react';

import { OverlayContext } from '@/contexts/OverlayContext';

import { useEnableDisable } from './toggle';

// eslint-disable-next-line import/prefer-default-export
export function useDismissable(defaultValue = false, onClose, autoDismiss = false, ref) {
  const overlay = React.useContext(OverlayContext);
  const [isOpen, setOpen, setClosed] = useEnableDisable(defaultValue);

  const handleClose = (event) => {
    if (ref?.current?.contains?.(event?.target)) {
      return;
    }

    onClose?.();

    setClosed();

    if (autoDismiss) {
      overlay.setHandler(null);
    }
  };

  const removeRootListener = () => document.removeEventListener('click', handleClose);

  const handleOpen = () => {
    if (autoDismiss && !overlay.canOpen()) {
      return;
    }

    setOpen();

    if (autoDismiss) {
      overlay.setHandler(() => {
        handleClose();
        removeRootListener();
      });
    }
  };

  const onToggle = isOpen ? handleClose : handleOpen;

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClose);

      return removeRootListener;
    }

    removeRootListener();
  }, [isOpen]);

  return [isOpen, onToggle, handleClose];
}
