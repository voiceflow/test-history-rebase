import client from '@/client';

import { EventName } from '../constants';
import { ProjectEventInfo } from '../types';
import { createProjectEventPayload, createProjectEventTracker } from '../utils';

export const trackActiveProjectSessionBegin = (options: ProjectEventInfo) => () =>
  client.analytics.track(EventName.PROJECT_SESSION_BEGIN, createProjectEventPayload(options));

export const trackActiveProjectSessionDuration = (options: ProjectEventInfo & { duration: number }) => () =>
  client.analytics.track(EventName.PROJECT_SESSION_DURATION, createProjectEventPayload(options, { duration: Math.floor(options.duration / 1000) }));

export const trackActiveProjectPrototypeTestStart = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_PROTOTYPE_TEST_START, createProjectEventPayload(options))
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
