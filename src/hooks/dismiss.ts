import React from 'react';

import { OverlayContext } from '@/contexts/OverlayContext';

import { useEnableDisable } from './toggle';

// eslint-disable-next-line import/prefer-default-export
export function useDismissable(
  defaultValue = false,
  onClose?: null | (() => void),
  autoDismiss = false,
  ref?: React.RefObject<Element>
): [boolean, () => void, (event?: MouseEvent) => void] {
  const overlay = React.useContext(OverlayContext);
  const [isOpen, setOpen, setClosed] = useEnableDisable(defaultValue);
  const rootNode = overlay?.rootNode ?? document;

  const handleClose = React.useCallback(
    (event?: Event) => {
      if (event?.defaultPrevented) return;
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

  const removeRootListener = React.useCallback(() => rootNode.removeEventListener('click', handleClose), [rootNode, handleClose]);

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

  const forceClose = React.useCallback(() => handleClose(), [handleClose]);

  const onToggle = isOpen ? forceClose : handleOpen;

  React.useEffect(() => {
    if (isOpen) {
      rootNode.addEventListener('click', handleClose);

      return () => {
        if (autoDismiss) {
          overlay?.setHandler(null);
        }

        removeRootListener();
      };
    }

    removeRootListener();

    return undefined;
  }, [isOpen, rootNode]);

  return [isOpen, onToggle, handleClose];
}
