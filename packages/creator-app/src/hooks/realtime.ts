import { LoguxReduxStore, useDispatch, useSubscription } from '@logux/redux';
import { Channels } from '@voiceflow/realtime-sdk';
import { useContext } from 'react';
import { createSelectorHook, createStoreHook } from 'react-redux';

import { RealtimeStoreContext } from '@/contexts/RealtimeStoreContext';
import { Nullable } from '@/types';

export type RealtimeWorkspaceSubscriptionProps = {};

export const useRealtimeDispatch = () => {
  const { store } = useContext(RealtimeStoreContext);

  return store.dispatch as ReturnType<typeof useDispatch>;
};

export const useRealtimeStore = createStoreHook(RealtimeStoreContext) as () => LoguxReduxStore;
export const useRealtimeSelector = createSelectorHook(RealtimeStoreContext);

export const useWorkspaceSubscription = (workspaceID: Nullable<string>): boolean =>
  useSubscription(workspaceID ? [Channels.workspace({ workspaceID })] : [], { context: RealtimeStoreContext as any });

export const useProjectSubscription = (projectID: Nullable<string>): boolean =>
  useSubscription(projectID ? [Channels.project({ projectID })] : [], { context: RealtimeStoreContext as any });

export const useVersionSubscription = (versionID: Nullable<string>): boolean =>
  useSubscription(versionID ? [Channels.version({ versionID })] : [], { context: RealtimeStoreContext as any });

export const useDiagramSubscription = (diagramID: Nullable<string>): boolean =>
  useSubscription(diagramID ? [Channels.diagram({ diagramID })] : [], {
    context: RealtimeStoreContext as any,
  });
