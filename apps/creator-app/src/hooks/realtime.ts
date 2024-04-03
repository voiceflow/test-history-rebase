import { useClient } from '@logux/client/react';
import { Channel, useSubscription } from '@logux/redux';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Channels } from '@voiceflow/sdk-logux-designer';
import { useCallback, useMemo, useRef } from 'react';
import { AnyAction } from 'typescript-fsa';

import LoguxClient from '@/client/logux';
import { Dispatchable, DispatchResult } from '@/store/types';
import { NullishRecord } from '@/types';

import { useStore } from './redux';

export const useRealtimeClient = useClient as () => LoguxClient;

export const useDispatch = <S extends any[], D extends any[], R extends Dispatchable>(
  createAction: (...args: [...S, ...D]) => R,
  ...staticArgs: S
) => {
  const store = useStore();

  return useCallback((...dynamicArgs: D): DispatchResult<R> => store.dispatch(createAction(...staticArgs, ...dynamicArgs)), staticArgs);
};

export const useLocalDispatch = <S extends any[], D extends any[], R extends AnyAction>(
  createAction: (...args: [...S, ...D]) => R,
  ...staticArgs: S
) => {
  const store = useStore();

  return useCallback((...dynamicArgs: D) => store.dispatch.local(createAction(...staticArgs, ...dynamicArgs)), staticArgs);
};

export const useCrossTabDispatch = <S extends any[], D extends any[], R extends AnyAction>(
  createAction: (...args: [...S, ...D]) => R,
  ...staticArgs: S
) => {
  const store = useStore();

  return useCallback((...dynamicArgs: D) => store.dispatch.crossTab(createAction(...staticArgs, ...dynamicArgs)), staticArgs);
};

export const useSyncDispatch = <S extends any[], D extends any[], R extends AnyAction>(
  createAction: (...args: [...S, ...D]) => R,
  ...staticArgs: S
) => {
  const store = useStore();

  return useCallback((...dynamicArgs: D) => store.dispatch.sync(createAction(...staticArgs, ...dynamicArgs)), staticArgs);
};

const createSubscriptionHook =
  <T>(buildChannels: (params: T) => Channel[]) =>
  (params: T, dependencies: any[] = [], { disabled = false }: { disabled?: boolean } = {}) => {
    const channels = useMemo(() => buildChannels(params), dependencies);
    const cachedChannelsRef = useRef<Channel[]>([]);
    const isLoading = useSubscription(channels);

    const cachedChannels = cachedChannelsRef.current;

    cachedChannelsRef.current = channels;

    if (disabled) return false;
    if (!channels.length) return false;
    if (channels !== cachedChannels) return false;

    return !isLoading;
  };

export const useCreatorSubscription = createSubscriptionHook<NullishRecord<Realtime.Channels.CreatorChannelParams>>(({ creatorID }) =>
  creatorID ? [Realtime.Channels.creator.build({ creatorID })] : []
);

export const useWorkspaceSubscription = createSubscriptionHook<NullishRecord<Realtime.Channels.WorkspaceChannelParams>>(({ workspaceID }) =>
  workspaceID ? [Realtime.Channels.workspace.build({ workspaceID })] : []
);

export const useOrganizationSubscription = createSubscriptionHook<NullishRecord<Channels.OrganizationParams>>(({ organizationID }) =>
  organizationID ? [Channels.organization.build({ organizationID })] : []
);

export const useVersionSubscription = createSubscriptionHook<NullishRecord<Realtime.Channels.VersionChannelParams>>(
  ({ workspaceID, projectID, versionID }) =>
    workspaceID && projectID && versionID
      ? [
          Realtime.Channels.workspace.build({ workspaceID }),
          Realtime.Channels.project.build({ workspaceID, projectID }),
          Realtime.Channels.version.build({ workspaceID, projectID, versionID }),
        ]
      : []
);

export const useAssistantSubscription = createSubscriptionHook<NullishRecord<Realtime.Channels.VersionChannelParams>>(
  ({ workspaceID, projectID, versionID }) =>
    workspaceID && projectID && versionID
      ? [
          Realtime.Channels.workspace.build({ workspaceID }),
          Realtime.Channels.project.build({ workspaceID, projectID }),
          Channels.assistant.build({ assistantID: projectID, environmentID: versionID }),
          Realtime.Channels.version.build({ workspaceID, projectID, versionID }),
        ]
      : []
);

export const useSchemaSubscription = createSubscriptionHook<NullishRecord<Realtime.Channels.SchemaChannelParams>>(({ versionID }) =>
  versionID ? [Realtime.Channels.schema.build({ versionID })] : []
);

export const useDiagramSubscription = createSubscriptionHook<NullishRecord<Realtime.Channels.DiagramChannelParams>>(
  ({ workspaceID, projectID, versionID, diagramID, domainID }) =>
    workspaceID && projectID && versionID && diagramID && domainID
      ? [Realtime.Channels.diagram.build({ workspaceID, projectID, versionID, diagramID, domainID })]
      : []
);

export const useDiagramSubscriptionV2 = createSubscriptionHook<NullishRecord<Realtime.Channels.DiagramChannelV2Params>>(
  ({ workspaceID, projectID, versionID, diagramID }) =>
    workspaceID && projectID && versionID && diagramID ? [Realtime.Channels.diagramV2.build({ workspaceID, projectID, versionID, diagramID })] : []
);
