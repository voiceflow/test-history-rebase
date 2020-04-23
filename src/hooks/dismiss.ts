import React from 'react';

import { OverlayContext } from '@/contexts/OverlayContext';

import { useEnableDisable } from './toggle';

// eslint-disable-next-line import/prefer-default-export
export function useDismissable(
  defaultValue = false,
  onClose?: () => void,
  autoDismiss = false,
  ref?: React.RefObject<Element>
): [boolean, () => void, (event?: MouseEvent) => void] {
  const overlay = React.useContext(OverlayContext);
  const [isOpen, setOpen, setClosed] = useEnableDisable(defaultValue);

  const handleClose = React.useCallback(
    (event?: MouseEvent) => {
      if (ref?.current?.contains?.(event?.target as Element)) {
        return;
      }

      onClose?.();

      setClosed();

      if (autoDismiss) {
        overlay?.setHandler(null);
      }
    },
    [onClose, autoDismiss, overlay?.setHandler]
  );

  const removeRootListener = React.useCallback(() => document.removeEventListener('click', handleClose), [handleClose]);

  const handleOpen = React.useCallback(() => {
    if (autoDismiss && !overlay?.canOpen()) {
      return;
    }

    setOpen();

    if (autoDismiss) {
      overlay?.setHandler(() => {
        handleClose();
        removeRootListener();
      });
    }
  }, [autoDismiss, overlay?.canOpen, overlay?.setHandler, handleClose, removeRootListener]);

  const onToggle = isOpen ? handleClose : handleOpen;

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClose);

      return () => {
        if (autoDismiss) {
          overlay?.setHandler(null);
        }

        removeRootListener();
      };
    }

    removeRootListener();

    return undefined;
  }, [isOpen]);

  return [isOpen, onToggle, handleClose];
}
