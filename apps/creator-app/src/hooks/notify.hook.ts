import { notify, useCreateConst } from '@voiceflow/ui-next';
import { useEffect, useRef } from 'react';

export const useNotificationDismiss = () => {
  const notificationIDRef = useRef<string | number | null>(null);

  const api = useCreateConst(() => ({
    set: (id: string | number) => {
      notificationIDRef.current = id;
    },

    get id() {
      return notificationIDRef.current;
    },

    dismiss: () => {
      if (!notificationIDRef.current) return false;

      notify.short.dismiss(notificationIDRef.current);
      notificationIDRef.current = null;

      return true;
    },
  }));

  useEffect(
    () => () => {
      api.dismiss();
    },
    []
  );

  return api;
};
