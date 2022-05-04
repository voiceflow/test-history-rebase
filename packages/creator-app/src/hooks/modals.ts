import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';
import { ModalContextType, ModalsContext } from '@/contexts/ModalsContext';

export interface ModalActions<T extends object = {}> {
  fade: boolean;
  data: T;
  open: (data?: T, onClose?: (() => void) | undefined) => void;
  close: () => void;
  toggle: (data?: T, onClose?: (() => void) | undefined) => void;
  update: (data?: any) => void;
  isOpened: boolean;
  isInStack: boolean;
}

export const useModals = <T extends object = {}>(modalId: ModalType): ModalActions<T> => {
  const { fade, open, close, update, toggle, openedId, modalData, stackModalIds } = React.useContext(ModalsContext);

  const isOpened = openedId === modalId;
  const isInStack = React.useMemo(() => stackModalIds.includes(modalId), [modalId, stackModalIds]);
  const cacheState = React.useRef<{ isInStack: boolean; onClose?: () => void }>({ isInStack });
  const memoData = React.useMemo(() => (isOpened ? modalData : ({} as T)), [isOpened, modalData]);

  const closeModal = React.useCallback(() => close(modalId), [close, modalId]);
  const updateModal = React.useCallback((data = {}) => update(modalId, data), [update, modalId]);

  const openModal = React.useCallback(
    (data: T = {} as T, onClose?: () => void) => {
      cacheState.current.onClose = onClose;
      open(modalId, data);
    },
    [open, modalId]
  );
  const toggleModal = React.useCallback(
    (data: T = {} as T, onClose?: () => void) => {
      cacheState.current.onClose = onClose;

      toggle(modalId, data);
    },
    [toggle, modalId]
  );

  React.useEffect(() => {
    if (!isInStack && cacheState.current.isInStack) {
      cacheState.current.onClose?.();
    }

    cacheState.current.isInStack = isInStack;
  }, [isInStack]);

  return useContextApi({
    fade,
    data: memoData as T,
    open: openModal,
    close: closeModal,
    toggle: toggleModal,
    update: updateModal,
    isOpened,
    isInStack,
  });
};

export const useActiveModal = <T extends object = {}>() => {
  const { close, update, openedId, modalData } = React.useContext(ModalsContext) as NonNullable<ModalContextType<T>>;

  return openedId
    ? {
        type: openedId,
        data: modalData,
        close,
        update,
      }
    : null;
};
