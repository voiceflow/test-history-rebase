import { useDispatch, useSubscription } from '@logux/redux';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useContext, useState } from 'react';
import { createSelectorHook, createStoreHook } from 'react-redux';

import { RealtimeStore, RealtimeStoreContext } from '@/contexts/RealtimeStoreContext';
import { RealtimeState } from '@/ducks/realtimeV2';
import { NullableRecord } from '@/types';

import { useSetup } from './lifecycle';

export const useRealtimeDispatch = () => {
  const { store } = useContext(RealtimeStoreContext);

  return store.dispatch as ReturnType<typeof useDispatch>;
};

export const useRealtimeStore = createStoreHook(RealtimeStoreContext as any) as () => RealtimeStore;
export const useRealtimeSelector = createSelectorHook<RealtimeState>(RealtimeStoreContext as any);

const useClientStateAndRole = (): [isLeader: boolean, isConnected: boolean] => {
  const realtimeStore = useRealtimeStore();

  const [isLeader, setIsLeader] = useState(realtimeStore.client.role === 'leader');
  const [isLeaderConnected, setIsLeaderConnected] = useState(realtimeStore.client.connected);

  useSetup(() => {
    const unsubscribeRole = realtimeStore.client.on('role', () => setIsLeader(realtimeStore.client.role === 'leader'));
    const unsubscribeState = realtimeStore.client.on('state', () => setIsLeaderConnected(realtimeStore.client.connected));

    return () => {
      unsubscribeRole();
      unsubscribeState();
    };
  });

  return [isLeader, isLeaderConnected];
};

export const useWorkspaceSubscription = ({ workspaceID }: NullableRecord<Realtime.Channels.WorkspaceChannelParams>): boolean => {
  const [isLeader, isLeaderConnected] = useClientStateAndRole();

  const subscribing = useSubscription(workspaceID ? [Realtime.Channels.workspace({ workspaceID })] : [], { context: RealtimeStoreContext as any });

  return isLeader ? !subscribing : isLeaderConnected;
};

export const useDiagramSubscription = ({ diagramID, projectID, workspaceID }: NullableRecord<Realtime.Channels.DiagramChannelParams>): boolean => {
  const [isLeader, isLeaderConnected] = useClientStateAndRole();

  const subscribing = useSubscription(
    diagramID && projectID && workspaceID ? [Realtime.Channels.diagram({ diagramID, projectID, workspaceID })] : [],
    { context: RealtimeStoreContext as any }
  );

  return isLeader ? !subscribing : isLeaderConnected;
};
