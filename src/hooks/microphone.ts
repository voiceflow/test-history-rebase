import React from 'react';

import * as Sentry from '@/vendors/sentry';

import { useSetup } from './lifecycle';
import { useToggle } from './toggle';

// eslint-disable-next-line import/prefer-default-export
export const useMicrophonePermission = ({ askOnSetup }: { askOnSetup?: boolean } = {}) => {
  const [permissionGranted, togglePermissionGranted] = useToggle(false);

  const checkMicrophonePermission = React.useCallback(async () => {
    try {
      await window.navigator.mediaDevices.getUserMedia({ audio: true });

      togglePermissionGranted(true);

      return true;
    } catch (err) {
      Sentry.error(err);
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
