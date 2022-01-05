import { Constants } from '@voiceflow/general-types';

import client from '@/client';
import { ControlScheme } from '@/components/Canvas/constants';
import { ExportFormat as CanvasExportFormat, NLPProvider } from '@/constants';
import { PrototypeSettings } from '@/ducks/prototype/types';
import { ExportType } from '@/pages/Project/components/Header/components/SharePopper/constants';

import { EventName } from '../constants';
import { VersionEventInfo } from '../types';
import {
  createProjectEventPayload,
  createProjectEventTracker,
  createVersionEventPayload,
  createVersionEventTracker,
  createWorkspaceEventPayload,
  createWorkspaceEventTracker,
} from '../utils';

export const trackActiveProjectSessionBegin = (options: VersionEventInfo) => () =>
  client.api.analytics.track(EventName.PROJECT_SESSION_BEGIN, createProjectEventPayload(options));

export const trackActiveProjectSessionDuration = (options: VersionEventInfo & { duration: number }) => () =>
  client.api.analytics.track(
    EventName.PROJECT_SESSION_DURATION,
    createProjectEventPayload(options, { duration: Math.floor(options.duration / 1000) })
  );

export const trackActiveProjectSettingsOpened = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_SETTINGS_OPENED, createVersionEventPayload(options))
);

export const trackActiveProjectDownloadLinkShare = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_SHARE_DOWNLOAD_LINK, createVersionEventPayload(options))
);

export const trackActiveProjectPublishAttempt = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_PUBLISH_ATTEMPT, createVersionEventPayload(options))
);

export const trackActiveProjectPublishSuccess = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_PUBLISH_SUCCESS, createVersionEventPayload(options))
);

export const trackActiveProjectExportInteractionModel = createVersionEventTracker<{ nlpProvider: NLPProvider }>((options) =>
  client.api.analytics.track(EventName.INTERACTION_MODEL_EXPORTED, createVersionEventPayload(options, { nlp_provider: options.nlpProvider }))
);

export const trackActiveProjectAlexaPublishPage = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_ALEXA_PUBLISH_PAGE, createVersionEventPayload(options))
);

export const trackActiveProjectGooglePublishPage = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_GOOGLE_PUBLISH_PAGE, createVersionEventPayload(options))
);

export const trackActiveProjectApiPage = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_API_PAGE, createVersionEventPayload(options))
);

export const trackActiveProjectCodeExportPage = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_CODE_EXPORT_PAGE, createVersionEventPayload(options))
);

export const trackActiveProjectVersionPage = createVersionEventTracker((options) =>
  client.api.analytics.track(EventName.PROJECT_VERSION_PAGE, createVersionEventPayload(options))
);

export const trackProjectRestore = createProjectEventTracker<{ versionID: string }>((options) =>
  client.api.analytics.track(EventName.PROJECT_RESTORE, createProjectEventPayload(options, { version_id: options.versionID }))
);

export const trackVersionPreview = createProjectEventTracker<{ versionID: string }>((options) =>
  client.api.analytics.track(EventName.VERSION_PREVIEW, createProjectEventPayload(options, { version_id: options.versionID }))
);

export const trackProjectClone =
  ({ templateID, workspaceID, templateName }: { templateID: string; workspaceID: string; templateName: string }) =>
  () =>
    client.api.analytics.track(
      EventName.CLONE_PROJECT,
      createWorkspaceEventPayload({ workspaceID }, { template_id: templateID, template_name: templateName }, { teamhashed: ['template_id'] })
    );

export const trackTestableLinkCopy = createVersionEventTracker<Partial<PrototypeSettings>>((options) =>
  client.api.analytics.track(
    EventName.SHARE_PROTOTYPE_LINK,
    createVersionEventPayload(options, {
      icon: !!options.avatar,
      image: !!options.brandImage,
      color: options.brandColor,
      layout: options.layout,
      password: !!options.password,
    })
  )
);

export const trackProjectMoveType = createVersionEventTracker<{ type: ControlScheme }>((options) =>
  client.api.analytics.track(EventName.PROJECT_MOVE_TYPE_CHANGED, createVersionEventPayload(options))
);

export const trackProjectDelete = createWorkspaceEventTracker<{ versionID?: string; projectID: string }>((options) =>
  client.api.analytics.track(
    EventName.PROJECT_DELETE,
    createWorkspaceEventPayload(options, { skill_id: options.versionID, project_id: options.projectID })
  )
);

export const trackProjectDuplicate = createWorkspaceEventTracker<{ versionID?: string; projectID: string }>((options) =>
  client.api.analytics.track(
    EventName.PROJECT_DUPLICATE,
    createWorkspaceEventPayload(options, { skill_id: options.versionID, project_id: options.projectID })
  )
);

export const trackProjectInviteCollaboratorsCopy = createWorkspaceEventTracker<{ projectID: string }>((options) =>
  client.api.analytics.track(EventName.PROJECT_INVITATION_COPY, createWorkspaceEventPayload(options, { project_id: options.projectID }))
);

export const trackProjectExit = createProjectEventTracker<{
  platform: Constants.PlatformType | null;
  canvasSessionDuration: number;
  prototypeSessionDuration: number;
  transcriptsSessionDuration: number;
}>(({ platform, canvasSessionDuration, prototypeSessionDuration, transcriptsSessionDuration, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_EXIT,
    createProjectEventPayload(options, {
      platform,
      canvasSessionDuration,
      prototypeSessionDuration,
      transcriptsSessionDuration,
    })
  )
);

export const trackProjectExported = createProjectEventTracker<{
  platform: Constants.PlatformType;
  template: boolean;
  exportType: ExportType;
  exportFormat: CanvasExportFormat;
}>(({ platform, template, exportType, exportFormat, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_EXPORTED,
    createProjectEventPayload(options, {
      platform,
      template,
      export_type: exportType === ExportType.CANVAS ? 'Project Content' : 'Interaction Model',
      export_format: exportFormat,
    })
  )
);
