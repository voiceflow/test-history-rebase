import { ChannelDeniedError, status as loguxStatus } from '@logux/client';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch, useRealtimeClient } from '@/hooks/realtime';
import * as ModalsV2 from '@/ModalsV2';

const isChannelDeniedAction = (action: unknown): action is ChannelDeniedError['action'] =>
  !!action && typeof (action as ChannelDeniedError['action'])?.action?.channel === 'string';

const RealtimeStatus: React.FC = () => {
  const client = useRealtimeClient();

  const refreshModal = ModalsV2.useModal(ModalsV2.Refresh);
  const goToDashboard = useDispatch(Router.goToDashboard);

  React.useEffect(
    () =>
      loguxStatus(client, (status, details) => {
        switch (status) {
          case 'denied':
            {
              const isWorkspace =
                details && 'action' in details && isChannelDeniedAction(details.action) && details.action.action.channel.startsWith('workspace');

              toast.warn(`You don't have access to that ${isWorkspace ? 'workspace' : 'project'}.`);

              goToDashboard();
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
