import { datadogRum } from '@datadog/browser-rum';
import { LOGROCKET_ENABLED } from '@ui/config';
import LogRocket from 'logrocket';
import React from 'react';

import { useSetup } from './lifecycle';
import { useToggle } from './toggle';

export const useMicrophonePermission = ({ askOnSetup }: { askOnSetup?: boolean } = {}) => {
  const [permissionGranted, togglePermissionGranted] = useToggle(false);

  const checkMicrophonePermission = React.useCallback(async () => {
    try {
      await window.navigator.mediaDevices.getUserMedia({ audio: true });

      togglePermissionGranted(true);

      return true;
    } catch (error) {
      if (LOGROCKET_ENABLED) {
        LogRocket.error(error);
      } else {
        datadogRum.addError(error);
      }
      togglePermissionGranted(false);

      return false;
    }
  }, []);

  useSetup(async () => {
    if (askOnSetup) {
      await checkMicrophonePermission();
    }
  });

  return [permissionGranted, checkMicrophonePermission] as const;
};
