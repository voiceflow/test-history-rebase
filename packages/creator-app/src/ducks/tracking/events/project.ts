import * as Platform from '@voiceflow/platform-config';

import client from '@/client';
import { ControlScheme } from '@/components/Canvas/constants';
import * as NLP from '@/config/nlp';
import { ExportFormat as CanvasExportFormat, ExportType, NLUImportOrigin } from '@/constants';
import { PrototypeSettings } from '@/ducks/prototype/types';
import * as Tracking from '@/ducks/tracking';

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

export const trackActiveProjectExportInteractionModel = createVersionEventTracker<{
  origin: Tracking.ModelExportOriginType;
  nlpType: NLP.Constants.NLPType;
}>((options) =>
  client.api.analytics.track(
    EventName.INTERACTION_MODEL_EXPORTED,
    createVersionEventPayload(options, { nlp_provider: options.nlpType, origin: options.origin })
  )
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

export const trackProjectExit = createProjectEventTracker<{
  nluType: Platform.Constants.NLUType;
  platform: Platform.Constants.PlatformType;
  creatorID: number;
  canvasSessionDuration: number;
  prototypeSessionDuration: number;
  nluManagerSessionDuration: number;
  transcriptsSessionDuration: number;
}>(
  ({
    nluType,
    platform,
    creatorID,
    canvasSessionDuration,
    prototypeSessionDuration,
    transcriptsSessionDuration,
    nluManagerSessionDuration,
    ...options
  }) =>
    client.api.analytics.track(
      EventName.PROJECT_EXIT,
      createProjectEventPayload(options, {
        nlu_type: nluType,
        platform,
        creatorID,
        canvasSessionDuration,
        prototypeSessionDuration,
        transcriptsSessionDuration,
        nluManagerSessionDuration,
      })
    )
);

export const trackProjectExported = createProjectEventTracker<{
  nluType: Platform.Constants.NLUType;
  platform: Platform.Constants.PlatformType;
  exportType: ExportType;
  exportFormat: CanvasExportFormat;
}>(({ nluType, platform, exportType, exportFormat, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_EXPORTED,
    createProjectEventPayload(options, {
      nlu_type: nluType,
      platform,
      export_type: exportType === ExportType.CANVAS ? 'Assistant Content' : 'Interaction Model',
      export_format: exportFormat,
    })
  )
);

export const trackProjectNLUImport = createProjectEventTracker<{
  origin: NLUImportOrigin;
  importNLPType: NLP.Constants.NLPType;
  targetNLUType: Platform.Constants.NLUType;
}>(({ origin, importNLPType, targetNLUType, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_NLU_IMPORT,
    createProjectEventPayload(options, { nlu_type: importNLPType, project_type: targetNLUType, origin })
  )
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

export const trackSubtopicCreated = createProjectEventTracker<{ topicID: string }>(({ topicID, ...options }) =>
  client.api.analytics.track(EventName.TOPIC_CREATED, createProjectEventPayload(options, { topic_id: topicID }))
);

export const trackComponentCreated = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.COMPONENT_CREATED, createProjectEventPayload(options))
);

export const trackComponentDeleted = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.COMPONENT_DELETED, createProjectEventPayload(options))
);

export const trackDomainDeleted = createProjectEventTracker<{
  nluType: Platform.Constants.NLUType;
  platform: Platform.Constants.PlatformType;
  domainID: string;
}>(({ nluType, platform, domainID, ...options }) =>
  client.api.analytics.track(EventName.DOMAIN_DELETED, createProjectEventPayload(options, { domain_id: domainID, nlu_type: nluType, platform }))
);

export const trackDomainCreated = createProjectEventTracker<{
  nluType: Platform.Constants.NLUType;
  platform: Platform.Constants.PlatformType;
  domainID: string;
}>(({ nluType, platform, domainID, ...options }) =>
  client.api.analytics.track(EventName.DOMAIN_CREATED, createProjectEventPayload(options, { domain_id: domainID, nlu_type: nluType, platform }))
);

export const trackDomainDuplicated = createProjectEventTracker<{
  nluType: Platform.Constants.NLUType;
  platform: Platform.Constants.PlatformType;
  domainID: string;
}>(({ nluType, platform, domainID, ...options }) =>
  client.api.analytics.track(EventName.DOMAIN_DUPLICATED, createProjectEventPayload(options, { domain_id: domainID, nlu_type: nluType, platform }))
);

export const trackDomainConvert = createWorkspaceEventTracker<{
  sourceNLUType?: Platform.Constants.NLUType;
  targetNLUType?: Platform.Constants.NLUType;
  sourcePlatform?: Platform.Constants.PlatformType;
  targetPlatform?: Platform.Constants.PlatformType;
  sourceProjectID: string;
  targetProjectID: string;
}>(({ sourceNLUType, targetNLUType, sourcePlatform, targetPlatform, sourceProjectID, targetProjectID, ...options }) =>
  client.api.analytics.track(
    EventName.DOMAIN_CONVERT,
    createWorkspaceEventPayload(options, {
      origin_nlu_type: sourceNLUType,
      origin_platform: sourcePlatform,
      origin_project_id: sourceProjectID,
      destination_nlu_type: targetNLUType,
      destination_platform: targetPlatform,
      destination_project_id: targetProjectID,
    })
  )
);

/** WEBCHAT EVENTS */
export const trackWebchatSnippetCopied = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.WEBCHAT_CONFIGURATION_SNIPPET_COPIED, createProjectEventPayload(options))
);

export const trackWebchatStatusChanged = createProjectEventTracker<{ status: string }>((options) =>
  client.api.analytics.track(EventName.WEBCHAT_CONFIGURATION_STATUS_CHANGED, createProjectEventPayload(options, { status: options.status }))
);

export const trackWebchatCustomization = createProjectEventTracker<{ element: string }>((options) =>
  client.api.analytics.track(EventName.WEBCHAT_CONFIGURATION_CUSTOMIZATION, createProjectEventPayload(options, { element: options.element }))
);
