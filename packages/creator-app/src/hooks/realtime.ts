import { useDispatch, useSubscription } from '@logux/redux';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useContext } from 'react';
import { createSelectorHook, createStoreHook } from 'react-redux';

import { RealtimeStore, RealtimeStoreContext } from '@/contexts/RealtimeStoreContext';
import { RealtimeState } from '@/ducks/realtimeV2';
import { NullableRecord } from '@/types';

export const useRealtimeDispatch = () => {
  const { store } = useContext(RealtimeStoreContext);

  return store.dispatch as ReturnType<typeof useDispatch>;
};

export const useRealtimeStore = createStoreHook(RealtimeStoreContext as any) as () => RealtimeStore;
export const useRealtimeSelector = createSelectorHook<RealtimeState>(RealtimeStoreContext as any);

export const useWorkspaceSubscription = ({ workspaceID }: NullableRecord<Realtime.Channels.WorkspaceChannelParams>): boolean =>
  !useSubscription(workspaceID ? [Realtime.Channels.workspace({ workspaceID })] : [], { context: RealtimeStoreContext as any });

export const useProjectSubscription = ({ projectID, workspaceID }: NullableRecord<Realtime.Channels.ProjectChannelParams>): boolean =>
  !useSubscription(projectID && workspaceID ? [Realtime.Channels.project({ projectID, workspaceID })] : [], { context: RealtimeStoreContext as any });

export const useDiagramSubscription = ({ diagramID, projectID, workspaceID }: NullableRecord<Realtime.Channels.DiagramChannelParams>): boolean =>
  !useSubscription(diagramID && projectID && workspaceID ? [Realtime.Channels.diagram({ diagramID, projectID, workspaceID })] : [], {
    context: RealtimeStoreContext as any,
  });
