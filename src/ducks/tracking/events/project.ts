import client from '@/client';
import { PrototypeMode } from '@/ducks/prototype/types';

import { EventName } from '../constants';
import { ProjectEventInfo } from '../types';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackActiveProjectSessionBegin = (options: ProjectEventInfo) => () =>
  client.analytics.track(EventName.PROJECT_SESSION_BEGIN, createProjectEventPayload(options));

export const trackActiveProjectSessionDuration = (options: ProjectEventInfo & { duration: number }) => () =>
  client.analytics.track(EventName.PROJECT_SESSION_DURATION, createProjectEventPayload(options, { duration: Math.floor(options.duration / 1000) }));

export const trackActiveProjectPrototypeTestClick = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_PROTOTYPE_TEST_CLICK, createProjectEventPayload(options))
);

export const trackActiveProjectPrototypeTestStart = createProjectEventTracker<{ debug: boolean; display: string | null; mode: PrototypeMode }>(
  (options) =>
    client.analytics.track(
      EventName.PROJECT_PROTOTYPE_TEST_START,
      createProjectEventPayload(options, { debug: options.debug, display: options.display, mode: options.mode })
    )
);

export const trackActiveProjectSettingsOpened = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_SETTINGS_OPENED, createProjectEventPayload(options))
);

export const trackActiveProjectTestableLinkShare = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_SHARE_TESTABLE_LINK, createProjectEventPayload(options))
);

export const trackActiveProjectDownloadLinkShare = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_SHARE_DOWNLOAD_LINK, createProjectEventPayload(options))
);

export const trackActiveProjectPublishAttempt = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_PUBLISH_ATTEMPT, createProjectEventPayload(options))
);

export const trackActiveProjectPublishSuccess = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_PUBLISH_SUCCESS, createProjectEventPayload(options))
);

export const trackProjectTrainAssistant = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_TRAIN_ASSISTANT, createProjectEventPayload(options))
);

export const trackProjectClone = ({
  template_id,
  template_name,
  workspace_id,
}: {
  template_id: string;
  template_name: string;
  workspace_id: string;
}) => () =>
  client.analytics.track(EventName.CLONE_PROJECT, {
    teamhashed: ['workspace_id', 'template_id'],
    properties: {
      template_id,
      template_name,
      workspace_id,
    },
  });
