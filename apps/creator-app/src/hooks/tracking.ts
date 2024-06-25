import type * as Platform from '@voiceflow/platform-config';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { Dispatch } from 'redux';

import * as NLU from '@/config/nlu';
import { NLUImportOrigin } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import * as TrackingEvents from '@/ducks/tracking/events';
import type { EventTracker } from '@/ducks/tracking/types';
import type { NLUImportModel } from '@/models';

import { useSessionStorageState } from './storage.hook';

const wrapDispatch = <T extends Record<string, (...args: any[]) => any>>(
  dispatch: Dispatch,
  obj: T
): { [key in keyof T]: (...args: Parameters<T[key]>) => ReturnType<T[key]> } =>
  Object.keys(obj).reduce(
    (acc, key) => Object.assign(acc, { [key]: (...args: any[]) => dispatch(obj[key](...args)) }),
    {} as any
  );

export const useTrackingEvents = () => {
  const dispatch = useDispatch();
  const events = React.useMemo(() => wrapDispatch(dispatch, TrackingEvents), [dispatch]);

  type Events = typeof events;

  const wrapper = React.useCallback(
    <T extends (...args: any[]) => any, A extends keyof Events>(
      callback: T | null,
      action: A,
      ...actionArgs: Parameters<Events[A]>
    ) =>
      (...args: Parameters<T>) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        events[action](...actionArgs);

        return callback?.(...args);
      },
    [events]
  );

  return [events, wrapper] as const;
};

export const useModelTracking = () => {
  const [trackEvents] = useTrackingEvents();

  return ({
    nluType,
    projectID,
    importedModel,
  }: {
    nluType: Platform.Constants.NLUType;
    projectID?: string;
    importedModel: NLUImportModel;
  }) => {
    const isImportingIntents = importedModel.intents?.length > 0;
    const isImportingEntities = importedModel.slots?.length > 0;

    const nluConfig = NLU.Config.get(nluType);

    if (projectID) {
      trackEvents.trackProjectNLUImportFromWorkspace({
        origin: NLUImportOrigin.PROJECT,
        projectID,
        importNLPType: nluConfig.nlps[0].type,
        targetNLUType: nluConfig.type,
      });

      if (isImportingIntents) {
        trackEvents.trackIntentCreatedProjectNLUImport({
          projectID,
          creationType: Tracking.CanvasCreationType.PROJECT_CREATE,
        });

        importedModel.intents.forEach((item) => {
          const isImportingUtterances = item?.inputs?.length > 0;

          if (isImportingUtterances) {
            trackEvents.trackNewUtteranceCreatedProjectNLUImport({
              creationType: Tracking.CanvasCreationType.PROJECT_CREATE,
              projectID,
            });
          }
        });
      }

      if (isImportingEntities) {
        trackEvents.trackEntityCreatedProjectNLUImport({
          creationType: Tracking.CanvasCreationType.PROJECT_CREATE,
          projectID,
        });
      }
    }
  };
};

export const useTrackPageOpenedFirstTime = (name: string, action: EventTracker<void>) => {
  const dispatch = useDispatch();
  const [isPageOpened, setPageOpened] = useSessionStorageState(name, false);

  useEffect(() => {
    if (!isPageOpened) {
      dispatch(action as any);
      setPageOpened(true);
    }
  }, []);
};
