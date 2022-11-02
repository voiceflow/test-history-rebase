import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import client from '@/client';
import * as NLP from '@/config/nlp';
import { NLURoute } from '@/config/routes';
import { NLUImportOrigin } from '@/constants';

import { CanvasCreationType, EventName, NLUManagerOpenedOrigin } from '../constants';
import { createProjectEventPayload, createProjectEventTracker, createWorkspaceEventPayload, createWorkspaceEventTracker } from '../utils';

export const trackProjectNLUImportFromWorkspace = createWorkspaceEventTracker<{
  nluType: NLP.Constants.NLPType | undefined;
  platform: VoiceflowConstants.PlatformType;
  origin: NLUImportOrigin;
  projectID: string;
}>(({ nluType, platform, projectID, origin, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_NLU_IMPORT,
    createWorkspaceEventPayload(options, { nlu_type: nluType, project_type: platform, origin, projectID })
  )
);

export const trackIntentCreatedProjectNLUImport = createWorkspaceEventTracker<{
  creationType: CanvasCreationType;
  projectID: string;
}>(({ creationType, projectID, ...options }) =>
  client.api.analytics.track(EventName.INTENT_CREATED, createWorkspaceEventPayload(options, { creation_type: creationType, project_id: projectID }))
);

export const trackEntityCreatedProjectNLUImport = createWorkspaceEventTracker<{
  creationType: CanvasCreationType;
  projectID: string;
}>(({ creationType, projectID, ...options }) =>
  client.api.analytics.track(EventName.ENTITY_CREATED, createWorkspaceEventPayload(options, { creation_type: creationType, project_id: projectID }))
);

export const trackNewUtteranceCreatedProjectNLUImport = createWorkspaceEventTracker<{
  creationType: CanvasCreationType;
  projectID: string;
}>(({ creationType, projectID, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_NEW_UTTERANCE_CREATED,
    createWorkspaceEventPayload(options, { creation_type: creationType, project_id: projectID })
  )
);

export const trackProjectNLUImportFailed = createProjectEventTracker<{
  nluType: NLP.Constants.NLPType | undefined;
  platform: VoiceflowConstants.PlatformType;
  origin: NLUImportOrigin;
}>(({ nluType, platform, origin, ...options }) =>
  client.api.analytics.track(
    EventName.PROJECT_NLU_IMPORT_FAILED,
    createProjectEventPayload(options, { nlu_type: nluType, project_type: platform, origin })
  )
);

export const trackConflictsViewed = createProjectEventTracker<{ intentID: string }>(({ intentID, ...options }) =>
  client.api.analytics.track(EventName.CONFLICTS_VIEWED, createProjectEventPayload(options, { intentID }))
);

export const trackConflictViewChangesApplied = createProjectEventTracker<{ intentID: string }>(({ intentID, ...options }) =>
  client.api.analytics.track(EventName.CONFLICT_VIEW_CHANGES_APPLIED, createProjectEventPayload(options, { intentID }))
);

export const trackUtteranceRecommendationsOpened = createProjectEventTracker<{ intentID: string }>(({ intentID, ...options }) =>
  client.api.analytics.track(EventName.UTTERANCE_RECOMMENDATION_OPENED, createProjectEventPayload(options, { intentID }))
);

export const trackUtteranceRecommendationRefreshed = createProjectEventTracker<{ intentID: string }>(({ intentID, ...options }) =>
  client.api.analytics.track(EventName.UTTERANCE_RECOMMENDATION_REFRESHED, createProjectEventPayload(options, { intentID }))
);

export const trackUtteranceRecommendationAccepted = createProjectEventTracker<{ intentID: string; utteranceName: string }>(
  ({ intentID, utteranceName, ...options }) =>
    client.api.analytics.track(EventName.UTTERANCE_RECOMMENDATION_ACCEPTED, createProjectEventPayload(options, { intentID, utteranceName }))
);

export const trackUtteranceRecommendationRejected = createProjectEventTracker<{ intentID: string; utteranceName: string }>(
  ({ intentID, utteranceName, ...options }) =>
    client.api.analytics.track(EventName.UTTERANCE_RECOMMENDATION_REJECTED, createProjectEventPayload(options, { intentID, utteranceName }))
);

export const trackNLUManagerOpened = createProjectEventTracker<{ origin: NLUManagerOpenedOrigin }>(({ origin, ...options }) =>
  client.api.analytics.track(EventName.NLU_MANAGER_OPENED, createProjectEventPayload(options, { origin }))
);

export const trackNLUManagerNavigation = createProjectEventTracker<{ tab: NLURoute }>(({ tab, ...options }) =>
  client.api.analytics.track(EventName.NLU_MANAGER_NAVIGATION, createProjectEventPayload(options, { view: tab }))
);

export const trackNLUNotificationsOpened = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.NLU_NOTIFICATIONS_OPENED, createProjectEventPayload(options))
);

export const trackNLUNotificationsClicked = createProjectEventTracker((options) =>
  client.api.analytics.track(EventName.NLU_NOTIFICATIONS_CLICKED, createProjectEventPayload(options))
);
