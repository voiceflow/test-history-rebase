import React from 'react';

import { ModalType } from '@/constants';
import { ModalContextType, ModalsContext } from '@/contexts';

// eslint-disable-next-line import/prefer-default-export
export const useModals = (modalId: ModalType) => {
  const { fade, open, close, update, toggle, openedId, modalData, stackModalIds } = React.useContext(ModalsContext) as NonNullable<ModalContextType>;

  const isOpened = openedId === modalId;
  const isInStack = React.useMemo(() => stackModalIds.includes(modalId), [modalId, stackModalIds]);
  const cacheState = React.useRef<{ isOpened: boolean; onClose?: () => void }>({ isOpened: openedId === modalId });

  const closeModal = React.useCallback(() => close(modalId), [close, modalId]);
  const updateModal = React.useCallback((data = {}) => update(modalId, data), [update, modalId]);

  const openModal = React.useCallback(
    (data: object = {}, onClose?: () => void) => {
      cacheState.current.onClose = onClose;
      open(modalId, data);
    },
    [open, modalId]
  );
  const toggleModal = React.useCallback(
    (data: object = {}, onClose?: () => void) => {
      cacheState.current.onClose = onClose;

      toggle(modalId, data);
    },
    [toggle, modalId]
  );

  React.useEffect(() => {
    if (!isOpened && cacheState.current.isOpened) {
      cacheState.current.onClose?.();
    }

    cacheState.current.isOpened = isOpened;
  }, [isOpened]);

  return {
    fade,
    data: modalData,
    open: openModal,
    close: closeModal,
    toggle: toggleModal,
    update: updateModal,
    isOpened,
    isInStack,
  };
};
