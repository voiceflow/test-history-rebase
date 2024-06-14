import { System } from '@voiceflow/ui';
import { usePersistFunction } from '@voiceflow/ui-next';
import React from 'react';
import { useIdleTimer } from 'react-idle-timer';

import InactivitySnackbar from '@/components/InactivitySnackbar';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks/redux';

import { TIMEOUT_COUNT } from './constants';

export const IddleWarning: React.FC = () => {
  const isOnlyViewer = useSelector(DiagramV2.isOnlyViewerSelector);
  const inactivitySnackbar = System.Snackbar.useAPI();

  const setIdle = usePersistFunction(() => {
    inactivitySnackbar.open();
    idleTimer.pause();
  });

  const idleTimer = useIdleTimer({
    onIdle: setIdle,
    element: document,
    timeout: TIMEOUT_COUNT,
    debounce: 250,
    startOnMount: false,
    startManually: true,
  });

  const setActive = usePersistFunction(() => {
    inactivitySnackbar.close();

    if (isOnlyViewer) {
      idleTimer.pause();
      return;
    }

    idleTimer.activate();
  });

  React.useEffect(() => {
    if (isOnlyViewer) {
      idleTimer.pause();
      return;
    }

    idleTimer.start();
  }, [isOnlyViewer]);

  return !isOnlyViewer && inactivitySnackbar.isOpen ? <InactivitySnackbar onDismiss={setActive} /> : null;
};
