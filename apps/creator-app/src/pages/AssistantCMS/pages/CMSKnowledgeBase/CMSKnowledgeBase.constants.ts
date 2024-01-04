import { BaseModels } from '@voiceflow/base-types';

export const refreshRateOptions = [
  { label: 'Never', value: BaseModels.Project.KnowledgeBaseDocumentRefreshRate.NEVER },
  { label: 'Daily', value: BaseModels.Project.KnowledgeBaseDocumentRefreshRate.DAILY },
  { label: 'Weekly', value: BaseModels.Project.KnowledgeBaseDocumentRefreshRate.WEEKLY },
  { label: 'Monthly', value: BaseModels.Project.KnowledgeBaseDocumentRefreshRate.MONTHLY },
] as const;
