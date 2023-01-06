import { logger } from '@voiceflow/ui';
import React from 'react';

import { IS_DEVELOPMENT } from '@/config';
import { useScheduled, useSetup } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

const log = logger.child('refreshModal');

const TrackNewCodeVersion: React.OldFC = () => {
  const pageCache = React.useRef<string>();
  const refreshModal = ModalsV2.useModal(ModalsV2.Refresh);

  const fetchPage = React.useCallback(async () => {
    const res = await fetch('/');

    return res.text();
  }, []);

  useSetup(async () => {
    if (IS_DEVELOPMENT) {
      return;
    }

    pageCache.current = await fetchPage();
  });

  useScheduled(['8pm', '8am'], async () => {
    if (!pageCache.current) return;

    log.info(log.pending('checking for new releases'));

    const nextPage = await fetchPage();

    if (nextPage !== pageCache.current) {
      pageCache.current = nextPage;

      log.info(log.success('new release found!'));
      refreshModal.openVoid();

      // to speedup refresh
      window.document.head.insertAdjacentHTML('beforeend', `<link rel="prerender" href="${window.location.href}" />`);
    }
  });

  return null;
};

export default TrackNewCodeVersion;
