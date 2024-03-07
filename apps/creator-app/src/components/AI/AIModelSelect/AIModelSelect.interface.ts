import { AIModel } from '@voiceflow/dtos';
import { BaseProps } from '@voiceflow/ui-next';

import { AIModelConfig } from '@/config/ai-model';

export interface IAIModelSelect {
  label?: string;
  value: AIModel;
  testID?: string;
  disabled?: boolean;
  onValueChange: (model: AIModel) => void;
}

export interface IAIModelSelectItem extends BaseProps {
  model: AIModelConfig;
  onClick: VoidFunction;
}
