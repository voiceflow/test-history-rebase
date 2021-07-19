import client from '@/client';
import { ControlScheme } from '@/components/Canvas/constants';
import { NLPProvider } from '@/constants';
import { PrototypeLayout } from '@/ducks/prototype/types';

import { EventName } from '../constants';
import { ProjectEventInfo, WorkspaceEventInfo } from '../types';
import { createProjectEventPayload, createProjectEventTracker, createWorkspaceEventPayload, createWorkspaceEventTracker } from '../utils';

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

export const trackActiveProjectAlexaPublishPage = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_ALEXA_PUBLISH_PAGE, createProjectEventPayload(options))
);

export const trackActiveProjectGooglePublishPage = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_GOOGLE_PUBLISH_PAGE, createProjectEventPayload(options))
);

export const trackActiveProjectApiPage = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_API_PAGE, createProjectEventPayload(options))
);

export const trackActiveProjectCodeExportPage = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_CODE_EXPORT_PAGE, createProjectEventPayload(options))
);

export const trackActiveProjectVersionPage = createProjectEventTracker((options) =>
  client.analytics.track(EventName.PROJECT_VERSION_PAGE, createProjectEventPayload(options))
);

export const trackProjectClone =
  ({ templateID, workspaceID, templateName }: { templateID: string; workspaceID: string; templateName: string }) =>
  () =>
    client.analytics.track(
      EventName.CLONE_PROJECT,
      createWorkspaceEventPayload({ workspaceID }, { template_id: templateID, template_name: templateName }, { teamhashed: ['template_id'] })
    );

export const trackTestableLinkCopy = createProjectEventTracker((options: ProjectEventInfo & { layout: PrototypeLayout }) =>
  client.analytics.track(EventName.SHARE_PROTOTYPE_LINK, createProjectEventPayload(options, { layout: options.layout }))
);

export const trackProjectMoveType = createProjectEventTracker((options: ProjectEventInfo & { type: ControlScheme }) =>
  client.analytics.track(EventName.PROJECT_MOVE_TYPE_CHANGED, createProjectEventPayload(options))
);

export const trackProjectDelete = createWorkspaceEventTracker(
  ({ workspaceID, versionID, projectID }: WorkspaceEventInfo & { versionID?: string; projectID: string }) =>
    client.analytics.track(EventName.PROJECT_DELETE, createWorkspaceEventPayload({ workspaceID }, { skill_id: versionID, project_id: projectID }))
);

export const trackProjectDuplicate = createWorkspaceEventTracker(
  ({ workspaceID, versionID, projectID }: WorkspaceEventInfo & { versionID?: string; projectID: string }) =>
    client.analytics.track(EventName.PROJECT_DUPLICATE, createWorkspaceEventPayload({ workspaceID }, { skill_id: versionID, project_id: projectID }))
);
