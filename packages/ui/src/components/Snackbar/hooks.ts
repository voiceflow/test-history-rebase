import { usePersistFunction } from '@ui/hooks';
import React from 'react';

export interface SnackbarAPI {
  open: VoidFunction;
  close: VoidFunction;
  isOpen: boolean;
}

export const useSnackbar = (options?: { initialShow: boolean }): SnackbarAPI => {
  const { initialShow = false } = options ?? {};

  const [isOpen, setIsOpen] = React.useState(!!initialShow);

  const open = usePersistFunction(() => setIsOpen(true));
  const close = usePersistFunction(() => setIsOpen(false));

  return {
    open,
    close,
    isOpen,
  };
};
