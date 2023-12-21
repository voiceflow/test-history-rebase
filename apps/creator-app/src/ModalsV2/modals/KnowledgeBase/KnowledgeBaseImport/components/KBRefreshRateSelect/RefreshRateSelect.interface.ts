import { BaseModels } from '@voiceflow/base-types';

export interface IRefreshRateSelect {
  value?: BaseModels.Project.KnowledgeBaseDocumentRefreshRate;
  disabled?: boolean;
  onValueChange: (value: BaseModels.Project.KnowledgeBaseDocumentRefreshRate) => void;
}
