import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { NLUImportOrigin, PlatformToNLPProvider } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import * as TrackingEvents from '@/ducks/tracking/events';
import { ImportModel } from '@/pages/NewProjectV2/types';

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

export const useModelTracking = (): ((
  platform: VoiceflowConstants.PlatformType,
  importedModel: ImportModel,
  trackingEvents: any,
  projectID?: string
) => void) => {
  return (platform: VoiceflowConstants.PlatformType, importedModel: ImportModel, trackingEvents: any, projectID?: string) => {
    const isImportingIntents = importedModel && importedModel.intents && importedModel.intents.length > 0;
    const isImportingEntities = importedModel && importedModel.slots && importedModel.slots.length > 0;

    if (projectID) {
      trackingEvents.trackProjectNLUImportFromWorkspace({
        platform,
        origin: NLUImportOrigin.PROJECT,
        nluType: PlatformToNLPProvider[platform],
        projectID,
      });

      if (isImportingIntents) {
        trackingEvents.trackIntentCreatedProjectNLUImport({
          creationType: Tracking.CanvasCreationType.PROJECT_CREATE,
          projectID,
        });

        importedModel.intents.every((item) => {
          const isImportingUtterances = item && item.inputs && item.inputs.length > 0;

          if (isImportingUtterances) {
            trackingEvents.trackNewUtteranceCreatedProjectNLUImport({
              creationType: Tracking.CanvasCreationType.PROJECT_CREATE,
              projectID,
            });
            return false;
          }
          return true;
        });
      }

      if (isImportingEntities) {
        trackingEvents.trackEntityCreatedProjectNLUImport({
          creationType: Tracking.CanvasCreationType.PROJECT_CREATE,
          projectID,
        });
      }
    } else {
      trackingEvents.trackProjectNLUImport({
        platform,
        origin: NLUImportOrigin.NLU_MANAGER,
        nluType: PlatformToNLPProvider[platform],
      });

      if (isImportingIntents) {
        trackingEvents.trackIntentCreated({ creationType: Tracking.CanvasCreationType.NLU_MANAGER });

        importedModel.intents.every((item: { inputs: string | any[]; key: any }) => {
          const isImportingUtterances = item && item.inputs && item.inputs.length > 0;

          if (isImportingUtterances) {
            trackingEvents.trackNewUtteranceCreated({ intentID: item.key, creationType: Tracking.CanvasCreationType.NLU_MANAGER });
            return false;
          }
          return true;
        });
      }

      if (isImportingEntities) {
        trackingEvents.trackEntityCreated({ creationType: Tracking.CanvasCreationType.NLU_MANAGER });
      }
    }
  };
};
