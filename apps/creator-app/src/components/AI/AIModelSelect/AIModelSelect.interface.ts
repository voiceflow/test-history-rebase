import type { AIModel } from '@voiceflow/dtos';
import type { BaseProps } from '@voiceflow/ui-next';

import type { AIModelConfig } from '@/config/ai-model';

export interface IAIModelSelect {
  label?: string;
  value: AIModel;
  testID?: string;
  disabled?: boolean;
  onValueChange: (value: AIModel) => void;
}

export interface IAIModelSelectItem extends BaseProps {
  model: AIModelConfig;
  onClick: VoidFunction;
}
