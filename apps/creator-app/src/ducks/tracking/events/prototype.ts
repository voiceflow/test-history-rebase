import { BaseNode } from '@voiceflow/base-types';

import client from '@/client';
import type { PrototypeLayout } from '@/constants/prototype';
import { prototypeContextStepSelector, prototypeVisualDeviceSelector } from '@/ducks/prototype/selectors';
import * as Recent from '@/ducks/recent';
import * as Session from '@/ducks/session';
import type { SyncThunk } from '@/store/types';

import { EventName } from '../constants';
import { createVersionEvent, createVersionEventTracker } from '../utils';

export const trackPrototypeManualNavForwardButton = createVersionEventTracker((eventInfo) =>
  client.analytics.track(
    createVersionEvent(EventName.PROTOTYPE_MANUAL_NAVIGATION, { ...eventInfo, direction: 'forward' })
  )
);

export const trackPrototypeManualNavBackwardButton = createVersionEventTracker((eventInfo) =>
  client.analytics.track(
    createVersionEvent(EventName.PROTOTYPE_MANUAL_NAVIGATION, { ...eventInfo, direction: 'backward' })
  )
);

export const trackProjectTrainAssistant = createVersionEventTracker<{ origin?: string }>((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_TRAIN_ASSISTANT, eventInfo))
);

export const trackActiveProjectPrototypeTestClick = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_PROTOTYPE_TEST_CLICK, eventInfo))
);

export const trackActiveProjectPrototypeTestStart = createVersionEventTracker<{
  debug: boolean;
  config: Omit<Recent.PrototypeConfig, 'platform'>;
  display: BaseNode.Visual.DeviceType | null;
}>(({ config, ...eventInfo }) =>
  client.analytics.track(
    createVersionEvent(EventName.PROJECT_PROTOTYPE_TEST_START, {
      ...eventInfo,
      display: eventInfo.display || BaseNode.Visual.DeviceType.DESKTOP,
      confidence_score: config?.intent,
      guided_navigation: config?.isGuided,
    })
  )
);

export const trackProjectBlockPrototypeTestStart = createVersionEventTracker((eventInfo, _dispatch, getState) => {
  const state = getState();

  const debug = Recent.prototypeDebugSelector(state);
  const display = prototypeVisualDeviceSelector(state);

  return client.analytics.track(
    createVersionEvent(EventName.PROJECT_BLOCK_TEST_START, {
      ...eventInfo,
      debug,
      display: display || BaseNode.Visual.DeviceType.DESKTOP,
    })
  );
});

export const trackProjectPrototypeEnd = createVersionEventTracker((eventInfo, _dispatch, getState) => {
  const state = getState();
  const contextStep = prototypeContextStepSelector(state);

  return client.analytics.track(
    createVersionEvent(EventName.PROJECT_CANVAS_PROTOTYPE_END, { ...eventInfo, interactions: contextStep })
  );
});

export const trackPublicPrototypeView =
  ({
    sessionID,
    versionID,
    ...data
  }: {
    device: string;
    layout: PrototypeLayout;
    sessionID: string;
    versionID: string;
  }): SyncThunk =>
  (_, getState) => {
    client.analytics.track({
      name: EventName.PUBLIC_PROTOTYPE_VIEW,
      identity: { anonymousID: Session.anonymousIDSelector(getState()) },
      properties: { ...data, version_id: versionID, session_id: sessionID, project_id: true, workspace_id: true },
    });
  };

export const trackPublicPrototypeInteract =
  ({ versionID, sessionID, ...data }: { device: string; sessionID: string; versionID: string }): SyncThunk =>
  (_, getState) => {
    client.analytics.track({
      name: EventName.PUBLIC_PROTOTYPE_USED,
      identity: { anonymousID: Session.anonymousIDSelector(getState()) },
      properties: { ...data, version_id: versionID, session_id: sessionID, project_id: true, workspace_id: true },
    });
  };
