import { BaseModels } from '@voiceflow/base-types';
import { AIModel } from '@voiceflow/dtos';

import client from '@/client';
import { ZendeskCountFilters } from '@/models/KnowledgeBase.model';

import { EventName } from '../constants';
import { createProjectEvent, createProjectEventTracker } from '../utils';

export const trackAiKnowledgeBaseOpen = createProjectEventTracker(({ ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_OPEN, { ...eventInfo }))
);

export const trackAiKnowledgeBaseSourceAdded = createProjectEventTracker<{
  Type: BaseModels.Project.KnowledgeBaseDocumentType;
  refreshRate?: string;
  numberOfDocuments?: number;
}>(({ ...eventInfo }) => client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_DATA_SOURCE_ADDED, eventInfo)));

export const trackAiKnowledgeBaseSourceUpdated = createProjectEventTracker<{ documentIDs: string[]; Update_Type: 'Refresh rate' | 'Text' }>(
  (eventInfo) => client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_DATA_SOURCE_UPDATED, eventInfo))
);

export const trackAiKnowledgeBaseSourceDeleted = createProjectEventTracker<{ documentIDs: string[] }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_DATA_SOURCE_DELETED, eventInfo))
);

export const trackAiKnowledgeBaseSourceError = createProjectEventTracker<{ documentID: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_DATA_SOURCE_ERROR, eventInfo))
);

export const trackAiKnowledgeBaseSourceStatusUpdated = createProjectEventTracker<{ documentID: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_DATA_SOURCE_STATUS_UPDATED, eventInfo))
);

export const trackAiKnowledgeBaseSourceResync = createProjectEventTracker<{ documentIDs: string[] }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_DATA_SOURCE_RESYNC, eventInfo))
);

export const trackAiKnowledgeBaseSettingsModified = createProjectEventTracker<{
  Mod_Type: 'LLM' | 'Temperature' | 'Max Tokens' | 'Persona' | 'Instruction';
  LLM_Updated: AIModel;
}>((eventInfo) => client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_SETTINGS_MODIFIED, eventInfo)));

export const trackAiKnowledgeQuestionPreviewed = createProjectEventTracker<{ Success: 'Yes' | 'No' }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_QUESTION_PREVIEWED, eventInfo))
);

export const trackAiKnowledgeBaseSearch = createProjectEventTracker<{ SearchTerm: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_SEARCH, eventInfo))
);

export const trackAiKnowledgeBaseError = createProjectEventTracker<{ ErrorType: 'Import' | 'Load' }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_ERROR, eventInfo))
);

export const trackAiKnowledgeBaseIntegrationConnected = createProjectEventTracker<{ IntegrationType: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_INTEGRATION_CONNECTED, eventInfo))
);

export const trackAiKnowledgeBaseIntegrationFailed = createProjectEventTracker<{ IntegrationType: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_INTEGRATION_CONNECTED, eventInfo))
);

export const trackAiKnowledgeBaseIntegrationSelected = createProjectEventTracker<{ IntegrationType: string }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_INTEGRATION_SELECTED, eventInfo))
);

export const trackAiKnowledgeBaseIntegrationFiltersUsed = createProjectEventTracker<{ Filters: ZendeskCountFilters }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_INTEGRATION_FILTERS_USED, eventInfo))
);
