import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Dispatch } from 'redux';

import * as Session from '@/ducks/session';
import * as TrackingEvents from '@/ducks/tracking/events';
import * as Workspace from '@/ducks/workspace';
import { ThunkResult } from '@/store/types';

import { useOneTimeEffect } from './effect';
import { useSetup, useTeardown } from './lifecycle';

const wrapDispatch = <T extends Record<string, (...args: any[]) => any>>(
  dispatch: Dispatch,
  obj: T
): { [key in keyof T]: (...args: Parameters<T[key]>) => ThunkResult<ReturnType<T[key]>> } =>
  Object.keys(obj).reduce((acc, key) => Object.assign(acc, { [key]: (...args: any[]) => dispatch(obj[key](...args)) }), {} as any);

export const useTrackingEvents = () => {
  const dispatch = useDispatch();
  const events = React.useMemo(() => wrapDispatch(dispatch, TrackingEvents), [dispatch]);

  type Events = typeof events;

  const wrapper = React.useCallback(
    <T extends (...args: any[]) => any, A extends keyof Events>(callback: T, action: A, ...actionArgs: Parameters<Events[A]>) =>
      (...args: Parameters<T>) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        events[action](...actionArgs);

        return callback(...args);
      },
    [events]
  );

  return [events, wrapper] as const;
};

export const useSessionTracking = () => {
  const [trackEvents] = useTrackingEvents();
  const authToken = useSelector(Session.authTokenSelector);
  const workspaceIDs = useSelector(Workspace.allWorkspaceIDsSelector);
  const startTime = React.useMemo(() => Date.now(), []);
  const trackSessionTime = React.useCallback(() => trackEvents.trackSessionDuration(Date.now() - startTime), []);

  useOneTimeEffect(() => {
    if (!authToken || workspaceIDs.length === 0) {
      return false;
    }

    trackEvents.trackSessionBegin(workspaceIDs);

    window.addEventListener('beforeunload', trackSessionTime);

    return true;
  }, [authToken, workspaceIDs]);
};

export const useWorkspaceTracking = () => {
  const [trackEvents] = useTrackingEvents();
  const workspace = useSelector(Workspace.activeWorkspaceSelector);

  React.useEffect(() => {
    if (workspace) {
      trackEvents.trackWorkspace(workspace);
    }
  }, [workspace]);
};

export const useCanvasTracking = () => {
  const [trackEvents] = useTrackingEvents();
  const store = useStore();
  const versionID = React.useMemo(() => Session.activeVersionIDSelector(store.getState())!, []);
  const projectID = React.useMemo(() => Session.activeProjectIDSelector(store.getState())!, []);
  const workspaceID = React.useMemo(() => Session.activeWorkspaceIDSelector(store.getState())!, []);
  const startTime = React.useMemo(() => Date.now(), []);

  const trackCanvasTime = React.useCallback(
    () =>
      trackEvents.trackActiveProjectSessionDuration({
        skillID: versionID,
        duration: Date.now() - startTime,
        projectID,
        workspaceID,
      }),
    []
  );

  useWorkspaceTracking();

  useSetup(() => {
    trackEvents.trackActiveProjectSessionBegin({
      skillID: versionID,
      projectID,
      workspaceID,
    });

    window.addEventListener('beforeunload', trackCanvasTime);
  });

  useTeardown(() => {
    window.removeEventListener('beforeunload', trackCanvasTime);
    trackCanvasTime();
  });
};
