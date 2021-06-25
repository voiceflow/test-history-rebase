import React from 'react';

import { DismissOverlayContext } from '../contexts/DismissOverlayContext';
import { useCache } from './cache';
import { useEnableDisable } from './toggle';

// eslint-disable-next-line import/prefer-default-export, sonarjs/cognitive-complexity
export function useDismissable(
  defaultValue = false,
  {
    ref,
    onClose,
    dismissEvent = 'click',
    disabledOverlay = false,
    skipDefaultPrevented = true,
  }: {
    ref?: React.RefObject<Element>;
    onClose?: null | (() => void);
    dismissEvent?: 'click' | 'mousedown';
    disabledOverlay?: boolean;
    skipDefaultPrevented?: boolean;
  } = {}
): [isOpen: boolean, toggle: () => void, close: (event?: MouseEvent) => void] {
  const dismissOverlay = React.useContext(DismissOverlayContext)!;
  const [isOpen, setOpen, setClosed] = useEnableDisable(defaultValue);

  const cache = useCache({ isOpen, onClose, skipDefaultPrevented });

  const handleOpen = React.useCallback(() => {
    if (cache.current.isOpen) return;

    cache.current.isOpen = true;
    dismissOverlay.dismissAll(); // dismiss all popovers on the current level
    setOpen();
  }, []);

  const handleClose = React.useCallback(
    (event?: Event) => {
      if (!cache.current.isOpen) return;
      if (cache.current.skipDefaultPrevented && event?.defaultPrevented) return;
      if (event?.target && ref?.current?.contains?.(event.target as Element)) return;

      cache.current.isOpen = false;
      setClosed();
      cache.current.onClose?.();
    },
    [dismissEvent]
  );

  const forceClose = React.useCallback(() => handleClose(), [handleClose]);

  const onToggle = isOpen ? forceClose : handleOpen;

  React.useEffect(() => {
    if (isOpen) {
      if (!disabledOverlay) {
        dismissOverlay.subscriber.subscribe(dismissEvent, handleClose);
        dismissOverlay.addHandler(handleClose);
      } else {
        dismissOverlay.rootNode.addEventListener(dismissEvent, handleClose);
      }

      return () => {
        if (!disabledOverlay) {
          dismissOverlay.subscriber.unsubscribe(dismissEvent, handleClose);
          dismissOverlay.removeHandler(handleClose);
        } else {
          dismissOverlay.rootNode.removeEventListener(dismissEvent, handleClose);
        }
      };
    }

    return undefined;
  }, [isOpen, handleClose, dismissOverlay]);

  return [isOpen, onToggle, handleClose];
}
