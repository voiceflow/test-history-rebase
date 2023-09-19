import { ChannelDeniedError, status as loguxStatus } from '@logux/client';
import { useDebouncedCallback, useThrottledCallback } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspaceV2';
import { useDispatch, useRealtimeClient } from '@/hooks/realtime';
import * as ModalsV2 from '@/ModalsV2';

const isChannelDeniedAction = (action: unknown): action is ChannelDeniedError['action'] =>
  !!action && typeof (action as ChannelDeniedError['action'])?.action?.channel === 'string';

const RealtimeStatus: React.FC = () => {
  const client = useRealtimeClient();

  const refreshModal = ModalsV2.useModal(ModalsV2.Refresh);

  const goToDashboard = useDispatch(Router.goToDashboard);
  const goToNextWorkspace = useDispatch(Workspace.goToNextWorkspace);

  const debouncedWarnToast = useDebouncedCallback(300, toast.warning);

  const throttledProjectDenied = useThrottledCallback(1000, () => {
    debouncedWarnToast(`You don't have access to that project.`);
    goToDashboard();
  });

  const throttledWorkspaceDenied = useThrottledCallback(3000, () => {
    debouncedWarnToast(`You don't have access to that workspace.`);
    goToNextWorkspace();
  });

  React.useEffect(
    () =>
      loguxStatus(client, (status, details) => {
        switch (status) {
          case 'denied':
            {
              const isWorkspace =
                details && 'action' in details && isChannelDeniedAction(details.action) && details.action.action.channel.startsWith('workspace');

              if (isWorkspace) {
                throttledWorkspaceDenied();
              } else {
                throttledProjectDenied();
              }
            }
            break;

          case 'protocolError':
            refreshModal.openVoid({ version: Date.now() });
            refreshModal.preventClose();
            break;

          default:
          // do nothing
        }
      }),
    [client]
  );

  return null;
};

export default RealtimeStatus;
