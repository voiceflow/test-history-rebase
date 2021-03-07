import client from '@/client';
import { NLPProvider } from '@/constants';

import { EventName } from '../constants';
import { ProjectEventInfo } from '../types';
import { createProjectEventPayload, createProjectEventTracker, createWorkspaceEventPayload } from '../utils';

export const trackActiveProjectSessionBegin = (options: ProjectEventInfo) => () =>
  client.analytics.track(EventName.PROJECT_SESSION_BEGIN, createProjectEventPayload(options));

export const trackActiveProjectSessionDuration = (options: ProjectEventInfo & { duration: number }) => () =>
  client.analytics.track(EventName.PROJECT_SESSION_DURATION, createProjectEventPayload(options, { duration: Math.floor(options.duration / 1000) }));

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

export const trackActiveProjectExportInteractionModel = createProjectEventTracker((options: ProjectEventInfo & { nlpProvider: NLPProvider }) =>
  client.analytics.track(EventName.INTERACTION_MODEL_EXPORTED, createProjectEventPayload(options, { nlp_provider: options.nlpProvider }))
);

export const trackProjectClone = ({
  templateID,
  workspaceID,
  templateName,
}: {
  templateID: string;
  workspaceID: string;
  templateName: string;
}) => () =>
  client.analytics.track(
    EventName.CLONE_PROJECT,
    createWorkspaceEventPayload({ workspaceID }, { template_id: templateID, template_name: templateName }, { teamhashed: ['template_id'] })
  );

export const trackTestableLinkCopy = createProjectEventTracker((options) =>
  client.analytics.track(EventName.SHARE_PROTOTYPE_LINK, createProjectEventPayload(options))
);
