import { Node } from '@voiceflow/base-types';

import client from '@/client';
import * as Prototype from '@/ducks/prototype';
import { PrototypeLayout, PrototypeMode } from '@/ducks/prototype/types';
import * as Recent from '@/ducks/recent';
import { SyncThunk } from '@/store/types';

import { EventName } from '../constants';
import { createVersionEventPayload, createVersionEventTracker } from '../utils';

export const trackPrototypeManualNavForwardButton = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROTOTYPE_MANUAL_NAVIGATION, createVersionEventPayload(options, { direction: 'forward' }))
);

export const trackPrototypeManualNavBackwardButton = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROTOTYPE_MANUAL_NAVIGATION, createVersionEventPayload(options, { direction: 'backward' }))
);

export const trackProjectTrainAssistant = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_TRAIN_ASSISTANT, createVersionEventPayload(options))
);

export const trackActiveProjectPrototypeTestClick = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_PROTOTYPE_TEST_CLICK, createVersionEventPayload(options))
);

export const trackActiveProjectPrototypeTestStart = createVersionEventTracker<{
  mode: PrototypeMode;
  debug: boolean;
  display: Node.Visual.DeviceType | null;
}>((options) =>
  client.api.analytics.track(
    EventName.PROJECT_PROTOTYPE_TEST_START,
    createVersionEventPayload(options, { debug: options.debug, display: options.display, mode: options.mode })
  )
);

export const trackProjectBlockPrototypeTestStart = createVersionEventTracker((options, _dispatch, getState) => {
  const state = getState();

  const debug = Recent.prototypeDebugSelector(state);
  const mode = Prototype.activePrototypeModeSelector(state);
  const display = Prototype.prototypeVisualDeviceSelector(state);

  client.api.analytics.track(EventName.PROJECT_BLOCK_TEST_START, createVersionEventPayload(options, { debug, display, mode }));
});

export const trackPublicPrototypeView =
  ({ versionID, ...data }: { device: string; layout: PrototypeLayout; versionID: string }): SyncThunk =>
  () => {
    client.api.analytics.track(EventName.PUBLIC_PROTOTYPE_VIEW, {
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
  () => {
    client.api.analytics.track(EventName.PUBLIC_PROTOTYPE_USED, {
      properties: {
        device,
        skill_id: versionID,
        session_id: sessionID,
      },
    });
  };
