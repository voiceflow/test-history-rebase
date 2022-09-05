import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client';
import { ControlScheme } from '@/components/Canvas/constants';
import { ExportFormat as CanvasExportFormat, ExportType, NLPProvider, NLUImportOrigin } from '@/constants';
import { PrototypeSettings } from '@/ducks/prototype/types';

import { EventName } from '../constants';
import { ProjectSessionEventInfo } from '../types';
import {
  createProjectEventPayload,
  createProjectEventTracker,
  createVersionEventPayload,
  createVersionEventTracker,
  createWorkspaceEventPayload,
  createWorkspaceEventTracker,
} from '../utils';

export const trackActiveProjectSessionBegin = (options: ProjectSessionEventInfo) => () =>
  client.api.analytics.track(EventName.PROJECT_SESSION_BEGIN, createProjectEventPayload(options));

export const trackActiveProjectSessionDuration = (options: ProjectSessionEventInfo & { duration: number }) => () =>
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
  platform: VoiceflowConstants.PlatformType | null;
  canvasSessionDuration: number;
  prototypeSessionDuration: number;
  transcriptsSessionDuration: number;
  nluManagerSessionDuration: number;
  creatorID: number;
}>(({ platform, canvasSessionDuration, prototypeSessionDuration, transcriptsSessionDuration, nluManagerSessionDuration, creatorID, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_EXIT,
    createProjectEventPayload(options, {
      platform,
      canvasSessionDuration,
      prototypeSessionDuration,
      transcriptsSessionDuration,
      nluManagerSessionDuration,
      creatorID,
    })
  )
);

export const trackProjectExported = createProjectEventTracker<{
  platform: VoiceflowConstants.PlatformType;
  exportType: ExportType;
  exportFormat: CanvasExportFormat;
}>(({ platform, exportType, exportFormat, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_EXPORTED,
    createProjectEventPayload(options, {
      platform,
      export_type: exportType === ExportType.CANVAS ? 'Project Content' : 'Interaction Model',
      export_format: exportFormat,
    })
  )
);

export const trackProjectNLUImport = createProjectEventTracker<{
  nluType: NLPProvider | undefined;
  platform: VoiceflowConstants.PlatformType;
  origin: NLUImportOrigin;
}>(({ nluType, platform, origin, ...options }) =>
  client.api.analytics.track(EventName.PROJECT_NLU_IMPORT, createProjectEventPayload(options, { nlu_type: nluType, project_type: platform, origin }))
);

export const trackTopicCreated = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.TOPIC_CREATED, createProjectEventPayload(options))
);

export const trackTopicDeleted = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.TOPIC_DELETED, createProjectEventPayload(options))
);

export const trackTopicConversion = createProjectEventTracker<{ diagramID: string }>(({ diagramID, ...options }) =>
  client.api.analytics.track(EventName.TOPIC_CONVERSION, createProjectEventPayload({ ...options, diagram_id: diagramID }))
);

export const trackComponentCreated = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.COMPONENT_CREATED, createProjectEventPayload(options))
);

export const trackComponentDeleted = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.COMPONENT_DELETED, createProjectEventPayload(options))
);

export const trackDomainDeleted = createProjectEventTracker<{ domainID: string; platform: VoiceflowConstants.PlatformType }>(
  ({ domainID, platform, ...options }) =>
    client.api.analytics.track(EventName.DOMAIN_DELETED, createProjectEventPayload(options, { domain_id: domainID, project_type: platform }))
);

export const trackDomainCreated = createProjectEventTracker<{ domainID: string; platform: VoiceflowConstants.PlatformType }>(
  ({ domainID, platform, ...options }) =>
    client.api.analytics.track(EventName.DOMAIN_CREATED, createProjectEventPayload(options, { domain_id: domainID, project_type: platform }))
);

export const trackDomainDuplicated = createProjectEventTracker<{ domainID: string; platform: VoiceflowConstants.PlatformType }>(
  ({ domainID, platform, ...options }) =>
    client.api.analytics.track(EventName.DOMAIN_DUPLICATED, createProjectEventPayload(options, { domain_id: domainID, project_type: platform }))
);

export const trackDomainConvert = createVersionEventTracker<{
  sourcePlatform?: VoiceflowConstants.PlatformType;
  targetPlatform?: VoiceflowConstants.PlatformType;
  sourceProjectID: string;
  targetProjectID: string;
}>(({ sourcePlatform, targetPlatform, sourceProjectID, targetProjectID, ...options }) =>
  client.api.analytics.track(
    EventName.DOMAIN_CONVERT,
    createVersionEventPayload(options, {
      origin_project_id: sourceProjectID,
      origin_project_type: sourcePlatform,
      destination_project_id: targetProjectID,
      destination_project_type: targetPlatform,
    })
  )
);
