import React from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import * as TrackingEvents from '@/ducks/tracking/events';

import { useActiveWorkspace } from './workspace';

const wrapDispatch = <T extends Record<string, (...args: any[]) => any>>(
  dispatch: Dispatch,
  obj: T
): { [key in keyof T]: (...args: Parameters<T[key]>) => ReturnType<T[key]> } =>
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

export const useWorkspaceTracking = (): void => {
  const [trackEvents] = useTrackingEvents();
  const workspace = useActiveWorkspace();

  React.useEffect(() => {
    if (workspace) {
      trackEvents.trackWorkspace(workspace);
    }
  }, [workspace]);
};
