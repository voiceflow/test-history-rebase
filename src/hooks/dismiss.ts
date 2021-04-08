import React from 'react';

import { OverlayContext } from '@/contexts/OverlayContext';

import { useEnableDisable } from './toggle';

// eslint-disable-next-line import/prefer-default-export
export function useDismissable(
  defaultValue = false,
  {
    ref,
    onClose,
    autoDismiss = false,
    dismissEvent = 'click',
    disabledOverlay = false,
    skipDefaultPrevented = true,
  }: {
    ref?: React.RefObject<Element>;
    onClose?: null | (() => void);
    autoDismiss?: boolean;
    dismissEvent?: 'click' | 'mousedown';
    disabledOverlay?: boolean;
    skipDefaultPrevented?: boolean;
  } = {}
): [boolean, () => void, (event?: MouseEvent) => void] {
  const overlay = React.useContext(OverlayContext);
  const [isOpen, setOpen, setClosed] = useEnableDisable(defaultValue);
  const rootNode = overlay?.rootNode ?? document;

  const handleClose = React.useCallback(
    (event?: Event) => {
      if (skipDefaultPrevented && event?.defaultPrevented) return;
      if (ref?.current?.contains?.(event?.target as Element)) {
        return;
      }

      onClose?.();

      setClosed();

      if (!disabledOverlay && autoDismiss) {
        overlay?.setHandler(null);
      }
    },
    [onClose, autoDismiss, overlay?.setHandler]
  );

  const removeRootListener = React.useCallback(() => rootNode.removeEventListener(dismissEvent, handleClose), [rootNode, handleClose]);

  const handleOpen = React.useCallback(() => {
    if (autoDismiss && !disabledOverlay && !overlay?.canOpen()) {
      return;
    }

    setOpen();

    if (!disabledOverlay && autoDismiss) {
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
      rootNode.addEventListener(dismissEvent, handleClose);

      return () => {
        if (!disabledOverlay && autoDismiss) {
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
