import { BaseNode } from '@voiceflow/base-types';

import client from '@/client';
import type { PrototypeLayout } from '@/constants/prototype';
import { prototypeContextStepSelector, prototypeVisualDeviceSelector } from '@/ducks/prototype/selectors';
import * as Recent from '@/ducks/recent';
import * as Session from '@/ducks/session';
import { SyncThunk } from '@/store/types';

import { AssistantOriginType, EventName } from '../constants';
import { createVersionEventPayload, createVersionEventTracker } from '../utils';

export const trackPrototypeManualNavForwardButton = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROTOTYPE_MANUAL_NAVIGATION, createVersionEventPayload(options, { direction: 'forward' }))
);

export const trackPrototypeManualNavBackwardButton = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROTOTYPE_MANUAL_NAVIGATION, createVersionEventPayload(options, { direction: 'backward' }))
);

export const trackProjectTrainAssistant = createVersionEventTracker<{ origin: AssistantOriginType }>((options) =>
  client.api.analytics.track(EventName.PROJECT_TRAIN_ASSISTANT, createVersionEventPayload(options, { origin: options.origin }))
);

export const trackActiveProjectPrototypeTestClick = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_PROTOTYPE_TEST_CLICK, createVersionEventPayload(options))
);

export const trackActiveProjectPrototypeTestStart = createVersionEventTracker<{
  debug: boolean;
  config: Omit<Recent.PrototypeConfig, 'platform'>;
  display: BaseNode.Visual.DeviceType | null;
}>((options) =>
  client.api.analytics.track(
    EventName.PROJECT_PROTOTYPE_TEST_START,
    createVersionEventPayload(options, {
      debug: options.debug,
      guidedNavigation: options.config?.isGuided,
      confidenceScore: options.config?.intent,
      display: options.display,
    })
  )
);

export const trackProjectBlockPrototypeTestStart = createVersionEventTracker((options, _dispatch, getState) => {
  const state = getState();

  const debug = Recent.prototypeDebugSelector(state);
  const display = prototypeVisualDeviceSelector(state);

  client.api.analytics.track(EventName.PROJECT_BLOCK_TEST_START, createVersionEventPayload(options, { debug, display }));
});

export const trackProjectPrototypeEnd = createVersionEventTracker((options, _dispatch, getState) => {
  const state = getState();
  const contextStep = prototypeContextStepSelector(state);

  client.api.analytics.track(EventName.PROJECT_CANVAS_PROTOTYPE_END, createVersionEventPayload(options, { interactions: contextStep }));
});

export const trackPublicPrototypeView =
  ({ versionID, ...data }: { device: string; layout: PrototypeLayout; versionID: string }): SyncThunk =>
  (_, getState) => {
    client.api.analytics.trackPublic(EventName.PUBLIC_PROTOTYPE_VIEW, {
      anonymousID: Session.anonymousIDSelector(getState()),
      properties: {
        ...data,
        skill_id: versionID,
        project_id: true,
        workspace_id: true,
      },
    });
  };

export const trackPublicPrototypeInteract =
  ({ device, versionID, sessionID }: { device: string; sessionID: string; versionID: string }): SyncThunk =>
  (_, getState) => {
    client.api.analytics.trackPublic(EventName.PUBLIC_PROTOTYPE_USED, {
      anonymousID: Session.anonymousIDSelector(getState()),
      properties: {
        device,
        skill_id: versionID,
        session_id: sessionID,
      },
    });
  };
