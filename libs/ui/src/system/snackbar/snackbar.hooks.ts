import { useEnableDisable } from '@ui/hooks/toggle';

import type * as I from './snackbar.interface';

interface Options {
  initialIsOpened?: boolean;
}

export const useAPI = ({ initialIsOpened = false }: Options = {}): I.API => {
  const [isOpen, open, close] = useEnableDisable(initialIsOpened);

  return {
    open,
    close,
    isOpen,
  };
};
