import { useContextApi, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const useConnectState = (isOpen: boolean) => {
  const [state, api] = useSmartReducerV2({ error: false, loading: false });

  const reset = () => {
    api.update({ error: false, loading: false });
  };

  const onLoad = () => {
    api.update({ error: false, loading: true });
  };

  const onFail = () => {
    api.update({ error: true, loading: false });
  };

  const connectAPI = useContextApi({
    reset,
    onLoad,
    onFail,
  });

  // this handles the edge case where modal is closed without authentication is completed
  React.useEffect(() => {
    if (!isOpen) {
      api.reset();
    }
  }, [isOpen]);

  return [state, connectAPI] as const;
};
