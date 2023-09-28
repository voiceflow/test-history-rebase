import React from 'react';

import { KnowledgeBaseContext } from '@/pages/KnowledgeBase/context';

export const useKBDocumentSync = () => {
  const syncInterval = React.useRef<number | null>(null);
  const { actions } = React.useContext(KnowledgeBaseContext);

  const clearSyncInterval = React.useCallback(() => {
    if (!syncInterval.current) return;
    clearInterval(syncInterval.current);
    syncInterval.current = null;
  }, []);

  React.useEffect(() => {
    actions.sync();
    return clearSyncInterval;
  }, []);

  return { clearSync: clearSyncInterval, syncInterval };
};
