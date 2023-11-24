import React from 'react';

import client from '@/client';

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
      client.log.error(error);
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
