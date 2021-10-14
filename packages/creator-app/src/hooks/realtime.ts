import { useSubscription } from '@logux/redux';
import * as Realtime from '@voiceflow/realtime-sdk';
import { useCallback } from 'react';
import { AnyAction } from 'typescript-fsa';

import { Dispatchable, DispatchResult } from '@/store/types';
import { NullableRecord } from '@/types';

import { useStore } from './redux';

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

export const useWorkspaceSubscription = ({ workspaceID }: NullableRecord<Realtime.Channels.WorkspaceChannelParams>): boolean =>
  !useSubscription(workspaceID ? [Realtime.Channels.workspace.build({ workspaceID })] : []);

export const useProjectSubscription = ({ projectID, workspaceID }: NullableRecord<Realtime.Channels.ProjectChannelParams>): boolean =>
  !useSubscription(projectID && workspaceID ? [Realtime.Channels.project.build({ projectID, workspaceID })] : []);

export const useDiagramSubscription = ({ diagramID, projectID, workspaceID }: NullableRecord<Realtime.Channels.DiagramChannelParams>): boolean =>
  !useSubscription(diagramID && projectID && workspaceID ? [Realtime.Channels.diagram.build({ diagramID, projectID, workspaceID })] : []);
