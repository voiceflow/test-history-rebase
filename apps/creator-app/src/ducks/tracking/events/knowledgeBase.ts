import { BaseModels, BaseUtils } from '@voiceflow/base-types';

import client from '@/client';

import { EventName } from '../constants';
import { createProjectEvent, createProjectEventTracker } from '../utils';

export const trackAiKnowledgeBaseOpen = createProjectEventTracker(({ ...eventInfo }) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_OPEN, { ...eventInfo }))
);

export const trackAiKnowledgeBaseSourceAdded = createProjectEventTracker<{
  Type: BaseModels.Project.KnowledgeBaseDocumentType;
}>(({ ...eventInfo }) => client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_DATA_SOURCE_ADDED, eventInfo)));

export const trackAiKnowledgeBaseSettingsModified = createProjectEventTracker<{
  Mod_Type: 'LLM' | 'Temperature' | 'Max Tokens' | 'Persona';
  LLM_Updated: BaseUtils.ai.GPT_MODEL;
}>((eventInfo) => client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_SETTINGS_MODIFIED, eventInfo)));

export const trackAiKnowledgeQuestionPreviewed = createProjectEventTracker<{ Success: 'Yes' | 'No' }>((eventInfo) =>
  client.analytics.track(createProjectEvent(EventName.AI_KNOWLEDGE_BASE_QUESTION_PREVIEWED, eventInfo))
);
