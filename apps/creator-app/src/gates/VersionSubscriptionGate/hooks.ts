import type { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useRealtimeClient } from '@/hooks';

export const useMigrationDoneObserver = (
  versionID: Nullable<string>,
  onComplete: (result: Realtime.version.schema.NegotiateResultPayload) => void
): void => {
  const realtimeClient = useRealtimeClient();

  React.useEffect(
    () =>
      realtimeClient.onAction(Realtime.version.schema.migrate.done, ({ payload: { params, result } }) => {
        if (params.versionID !== versionID) return;

        onComplete(result);
      }),
    [versionID]
  );
};

export const useMigrationFailedObserver = (
  versionID: Nullable<string>,
  onFailed: (error: Realtime.RealtimeError) => void
): void => {
  const realtimeClient = useRealtimeClient();

  React.useEffect(
    () =>
      realtimeClient.onAction(Realtime.version.schema.migrate.failed, ({ payload: { params, error } }) => {
        if (params.versionID !== versionID) return;

        onFailed(error);
      }),
    [versionID]
  );
};
