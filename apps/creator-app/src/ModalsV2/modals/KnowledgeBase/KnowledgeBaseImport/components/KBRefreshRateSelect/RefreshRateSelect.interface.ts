import type { BaseModels } from '@voiceflow/base-types';
import type { BaseProps } from '@voiceflow/ui-next';

export interface IRefreshRateSelect extends BaseProps {
  value?: BaseModels.Project.KnowledgeBaseDocumentRefreshRate;
  disabled?: boolean;
  onValueChange: (value: BaseModels.Project.KnowledgeBaseDocumentRefreshRate) => void;
}
