import * as Platform from '@voiceflow/platform-config';

import client from '@/client';
import { ControlScheme } from '@/components/Canvas/constants';
import * as NLP from '@/config/nlp';
import { ExportFormat as CanvasExportFormat, ExportType } from '@/constants';
import { projectByIDSelector } from '@/ducks/projectV2/selectors';
import { PrototypeSettings } from '@/ducks/prototype/types';

import { EventName } from '../constants';
import { ProjectSessionEventInfo } from '../types';
import {
  createBaseEventTracker,
  createProjectEvent,
  createProjectEventTracker,
  createVersionEvent,
  createVersionEventTracker,
  createWorkspaceEventTracker,
} from '../utils';

export const trackActiveProjectSessionBegin = createBaseEventTracker<ProjectSessionEventInfo>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.PROJECT_SESSION_BEGIN, eventInfo))
);

export const trackActiveProjectSessionDuration = createBaseEventTracker<ProjectSessionEventInfo & { duration: number }>(
  ({ duration, ...eventInfo }) => client.analytics.track(createProjectEvent(EventName.PROJECT_SESSION_DURATION, eventInfo))
);

export const trackProjectExit = createBaseEventTracker<
  ProjectSessionEventInfo & {
    canvasSessionDuration: number;
    prototypeSessionDuration: number;
    projectCMSSessionDuration: number;
    transcriptsSessionDuration: number;
  }
>(({ canvasSessionDuration, prototypeSessionDuration, projectCMSSessionDuration, transcriptsSessionDuration, ...eventInfo }) =>
  client.analytics.track(
    createProjectEvent(EventName.PROJECT_EXIT, {
      ...eventInfo,
      canvas_session_duration: canvasSessionDuration,
      prototype_session_duration: prototypeSessionDuration,
      project_cms_session_duration: projectCMSSessionDuration,
      transcripts_session_duration: transcriptsSessionDuration,
    })
  )
);

export const trackProjectDelete = createWorkspaceEventTracker<{ projectID: string }>((eventInfo, _, getState) => {
  const project = projectByIDSelector(getState(), { id: eventInfo.projectID });

  if (!project) return undefined;

  return client.analytics.track(
    createProjectEvent(EventName.PROJECT_DELETE, {
      ...eventInfo,
      nluType: project.nlu,
      platform: project.platform,
      version_id: project.versionID,
      projectType: project.type,
    })
  );
});

export const trackProjectCreated = createWorkspaceEventTracker<{
  source: unknown;
  channel: string;
  modality: Platform.Constants.ProjectType;
  language: string;
  projectID: string;
  onboarding?: boolean;
  workspaceID: string;
  assistantType?: string;
  source_project_id?: string;
}>((eventInfo, _, getState) => {
  const project = projectByIDSelector(getState(), { id: eventInfo.projectID });

  const sharedInfo = {
    ...eventInfo,
    project_id: eventInfo.projectID,
    original_project_id: eventInfo.source_project_id,
  };

  const envIDs = ['project_id', 'original_project_id', 'source_project_id'] as const;

  if (!project) {
    return client.analytics.track(
      createProjectEvent(
        EventName.PROJECT_CREATED,
        {
          ...sharedInfo,
          nluType: Platform.Constants.NLUType.VOICEFLOW,
          platform: eventInfo.channel as Platform.Constants.PlatformType,
          projectType: eventInfo.modality as Platform.Constants.ProjectType,
          original_project_id: eventInfo.source_project_id,
        },
        { envIDs: [...envIDs] }
      )
    );
  }

  return client.analytics.track(
    createProjectEvent(
      EventName.PROJECT_CREATED,
      {
        ...sharedInfo,
        nluType: project.nlu,
        platform: project.platform,
        versionID: project.versionID,
        version_id: project.versionID,
        projectType: project.type,
      },
      { envIDs: [...envIDs] }
    )
  );
});

export const trackProjectExported = createVersionEventTracker<{ exportType: ExportType; exportFormat: CanvasExportFormat }>(
  ({ exportType, exportFormat, ...eventInfo }) =>
    client.analytics.track(
      createVersionEvent(EventName.PROJECT_EXPORTED, {
        ...eventInfo,
        export_type: exportType === ExportType.CANVAS ? 'Agent Content' : 'Interaction Model',
        export_format: exportFormat,
      })
    )
);

export const trackBackupPreview = createProjectEventTracker<{ versionID: string; backupID: number }>((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.BACKUP_PREVIEW, eventInfo))
);

export const trackActiveProjectSettingsOpened = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_SETTINGS_OPENED, eventInfo))
);

export const trackActiveProjectDownloadLinkShare = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_SHARE_DOWNLOAD_LINK, eventInfo))
);

export const trackActiveProjectPublishAttempt = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_PUBLISH_ATTEMPT, eventInfo))
);

export const trackActiveProjectExportInteractionModel = createVersionEventTracker<{
  origin: string;
  nlpType: NLP.Constants.NLPType;
}>(({ nlpType, ...eventInfo }) =>
  client.analytics.track(createVersionEvent(EventName.INTERACTION_MODEL_EXPORTED, { ...eventInfo, nlp_provider: nlpType }))
);

export const trackActiveProjectApiPage = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_API_PAGE, eventInfo))
);

export const trackActiveProjectCodeExportPage = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_CODE_EXPORT_PAGE, eventInfo))
);

export const trackActiveProjectVersionPage = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_VERSION_PAGE, eventInfo))
);

export const trackTestableLinkCopy = createVersionEventTracker<Partial<PrototypeSettings>>(
  ({ avatar, brandImage, brandColor, password, ...eventInfo }) =>
    client.analytics.track(
      createVersionEvent(EventName.SHARE_PROTOTYPE_LINK, {
        ...eventInfo,
        icon: !!avatar,
        image: !!brandImage,
        color: brandColor,
        password: !!password,
      })
    )
);

export const trackProjectMoveType = createVersionEventTracker<{ type: ControlScheme }>((eventInfo) =>
  client.analytics.track(createVersionEvent(EventName.PROJECT_MOVE_TYPE_CHANGED, eventInfo))
);

/** WEBCHAT EVENTS */
export const trackWebchatSnippetCopied = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.WEBCHAT_CONFIGURATION_SNIPPET_COPIED, eventInfo))
);

export const trackWebchatStatusChanged = createVersionEventTracker<{ status: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.WEBCHAT_CONFIGURATION_STATUS_CHANGED, eventInfo))
);

export const trackWebchatCustomization = createVersionEventTracker<{ element: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.WEBCHAT_CONFIGURATION_CUSTOMIZATION, eventInfo))
);

// PROJECT API
export const trackProjectAPIKeyCopied = createVersionEventTracker((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.API_KEY_COPIED, eventInfo))
);
