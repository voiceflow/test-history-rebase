import { datadogRum } from '@datadog/browser-rum';
import { ChannelDeniedError, status as loguxStatus } from '@logux/client';
import { useDebouncedCallback, useThrottledCallback } from '@voiceflow/ui';
import { Link, notify } from '@voiceflow/ui-next';
import React from 'react';

import { GET_HELP_LINK } from '@/constants/link.constant';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspaceV2';
import { useDispatch, useRealtimeClient } from '@/hooks/realtime';
import * as ModalsV2 from '@/ModalsV2';

const isChannelErrorAction = (action: unknown): action is ChannelDeniedError['action'] =>
  !!action && typeof (action as ChannelDeniedError['action'])?.action?.channel === 'string';

const RealtimeStatus: React.FC = () => {
  const client = useRealtimeClient();

  const refreshModal = ModalsV2.useModal(ModalsV2.Refresh);

  const goToDashboard = useDispatch(Router.goToDashboard);
  const goToNextWorkspace = useDispatch(Workspace.goToNextWorkspace);

  const debouncedWarnToast = useDebouncedCallback(300, notify.long.warning);

  const throttledProjectDenied = useThrottledCallback(1000, () => {
    debouncedWarnToast("You don't have access to that project.");
    goToDashboard();
  });

  const throttledWorkspaceDenied = useThrottledCallback(3000, () => {
    debouncedWarnToast("You don't have access to that workspace.");
    goToNextWorkspace();
  });

  React.useEffect(
    () =>
      loguxStatus(client, (status, details) => {
        switch (status) {
          case 'error':
            datadogRum.addError('RealtimeError', details);

            if (details && 'action' in details && isChannelErrorAction(details.action)) {
              const { channel } = details.action.action;
              const channelParts = channel.split('/');
              const resource = channelParts[channelParts.length - 2] ?? channel;

              notify.long.warning(
                <>
                  Unable to load {resource}, please try again. If the issue continues,{' '}
                  <Link inline weight="semiBold" label="contact support" href={GET_HELP_LINK} target="_blank" />.
                </>,
                {
                  autoClose: false,
                  bodyClassName: 'vfui',
                  actionButtonProps: {
                    label: 'Refresh',
                    onClick: () => window.location.reload(),
                  },
                }
              );
            }

            break;

          case 'denied':
            {
              datadogRum.addError('RealtimeDenied', details);

              const isWorkspace =
                details &&
                'action' in details &&
                isChannelErrorAction(details.action) &&
                details.action.action.channel.startsWith('workspace');

              if (isWorkspace) {
                throttledWorkspaceDenied();
              } else {
                throttledProjectDenied();
              }
            }
            break;

          case 'protocolError':
            datadogRum.addError('RealtimeProtocolError', details);
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
