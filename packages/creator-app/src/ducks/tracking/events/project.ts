import client from '@/client';
import { ControlScheme } from '@/components/Canvas/constants';
import { NLPProvider } from '@/constants';
import { PrototypeSettings } from '@/ducks/prototype/types';

import { EventName } from '../constants';
import { ProjectEventInfo, WorkspaceEventInfo } from '../types';
import { createProjectEventPayload, createProjectEventTracker, createWorkspaceEventPayload, createWorkspaceEventTracker } from '../utils';

export const trackActiveProjectSessionBegin = (options: ProjectEventInfo) => () =>
  client.api.analytics.track(EventName.PROJECT_SESSION_BEGIN, createProjectEventPayload(options));

export const trackActiveProjectSessionDuration = (options: ProjectEventInfo & { duration: number }) => () =>
  client.api.analytics.track(
    EventName.PROJECT_SESSION_DURATION,
    createProjectEventPayload(options, { duration: Math.floor(options.duration / 1000) })
  );

export const trackActiveProjectSettingsOpened = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_SETTINGS_OPENED, createProjectEventPayload(options))
);

export const trackActiveProjectDownloadLinkShare = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_SHARE_DOWNLOAD_LINK, createProjectEventPayload(options))
);

export const trackActiveProjectPublishAttempt = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_PUBLISH_ATTEMPT, createProjectEventPayload(options))
);

export const trackActiveProjectPublishSuccess = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_PUBLISH_SUCCESS, createProjectEventPayload(options))
);

export const trackActiveProjectExportInteractionModel = createProjectEventTracker((options: ProjectEventInfo & { nlpProvider: NLPProvider }) =>
  client.api.analytics.track(EventName.INTERACTION_MODEL_EXPORTED, createProjectEventPayload(options, { nlp_provider: options.nlpProvider }))
);

export const trackActiveProjectAlexaPublishPage = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_ALEXA_PUBLISH_PAGE, createProjectEventPayload(options))
);

export const trackActiveProjectGooglePublishPage = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_GOOGLE_PUBLISH_PAGE, createProjectEventPayload(options))
);

export const trackActiveProjectApiPage = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_API_PAGE, createProjectEventPayload(options))
);

export const trackActiveProjectCodeExportPage = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_CODE_EXPORT_PAGE, createProjectEventPayload(options))
);

export const trackActiveProjectVersionPage = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_VERSION_PAGE, createProjectEventPayload(options))
);

export const trackProjectClone =
  ({ templateID, workspaceID, templateName }: { templateID: string; workspaceID: string; templateName: string }) =>
  () =>
    client.api.analytics.track(
      EventName.CLONE_PROJECT,
      createWorkspaceEventPayload({ workspaceID }, { template_id: templateID, template_name: templateName }, { teamhashed: ['template_id'] })
    );

export const trackTestableLinkCopy = createProjectEventTracker((options: ProjectEventInfo & Partial<PrototypeSettings>) =>
  client.api.analytics.track(
    EventName.SHARE_PROTOTYPE_LINK,
    createProjectEventPayload(options, {
      layout: options.layout,
      color: options.brandColor,
      password: !!options.password,
      image: !!options.brandImage,
      icon: !!options.avatar,
    })
  )
);

export const trackProjectMoveType = createProjectEventTracker((options: ProjectEventInfo & { type: ControlScheme }) =>
  client.api.analytics.track(EventName.PROJECT_MOVE_TYPE_CHANGED, createProjectEventPayload(options))
);

export const trackProjectDelete = createWorkspaceEventTracker(
  ({ workspaceID, versionID, projectID }: WorkspaceEventInfo & { versionID?: string; projectID: string }) =>
    client.api.analytics.track(EventName.PROJECT_DELETE, createWorkspaceEventPayload({ workspaceID }, { skill_id: versionID, project_id: projectID }))
);

export const trackProjectDuplicate = createWorkspaceEventTracker(
  ({ workspaceID, versionID, projectID }: WorkspaceEventInfo & { versionID?: string; projectID: string }) =>
    client.api.analytics.track(
      EventName.PROJECT_DUPLICATE,
      createWorkspaceEventPayload({ workspaceID }, { skill_id: versionID, project_id: projectID })
    )
);

export const trackProjectInviteCollaboratorsCopy = createWorkspaceEventTracker(
  ({ workspaceID, projectID }: WorkspaceEventInfo & { projectID: string }) =>
    client.api.analytics.track(EventName.PROJECT_INVITATION_COPY, createWorkspaceEventPayload({ workspaceID }, { project_id: projectID }))
);
