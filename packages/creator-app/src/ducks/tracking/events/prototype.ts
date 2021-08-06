import { DeviceType } from '@voiceflow/general-types';

import client from '@/client';
import * as Prototype from '@/ducks/prototype';
import { PrototypeMode } from '@/ducks/prototype/types';
import * as Recent from '@/ducks/recent';

import { EventName } from '../constants';
import { ProjectEventInfo } from '../types';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackPrototypeManualNavForwardButton = createProjectEventTracker((options: ProjectEventInfo) =>
  client.analytics.track(EventName.PROTOTYPE_MANUAL_NAVIGATION, createProjectEventPayload(options, { direction: 'forward' }))
);

export const trackPrototypeManualNavBackwardButton = createProjectEventTracker((options: ProjectEventInfo) =>
  client.analytics.track(EventName.PROTOTYPE_MANUAL_NAVIGATION, createProjectEventPayload(options, { direction: 'backward' }))
);

export const trackProjectTrainAssistant = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_TRAIN_ASSISTANT, createProjectEventPayload(options))
);

export const trackActiveProjectPrototypeTestClick = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_PROTOTYPE_TEST_CLICK, createProjectEventPayload(options))
);

export const trackActiveProjectPrototypeTestStart = createProjectEventTracker<{ debug: boolean; display: DeviceType | null; mode: PrototypeMode }>(
  (options) =>
    client.analytics.track(
      EventName.PROJECT_PROTOTYPE_TEST_START,
      createProjectEventPayload(options, { debug: options.debug, display: options.display, mode: options.mode })
    )
);

export const trackProjectBlockPrototypeTestStart = createProjectEventTracker((options, _dispatch, getState) => {
  const state = getState();

  const debug = Recent.prototypeDebugSelector(state);
  const display = Prototype.prototypeVisualDeviceSelector(state);
  const mode = Prototype.activePrototypeModeSelector(state);

  client.analytics.track(EventName.PROJECT_BLOCK_TEST_START, createProjectEventPayload(options, { debug, display, mode }));
});
