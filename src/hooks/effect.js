import { useEffect } from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useAsyncMountUnmount = (didMount, willUnmount) => {
  useEffect(() => {
    didMount();

    if (willUnmount) {
      return willUnmount;
    }
  }, []);
};
