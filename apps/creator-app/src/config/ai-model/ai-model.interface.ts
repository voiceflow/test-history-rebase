import { AIModel } from '@voiceflow/dtos';
import type { IconName } from '@voiceflow/icons';

export interface AIModelConfig {
  type: AIModel;
  name: string;
  info: string;
  icon: IconName;
  hidden?: boolean;
  disabled?: boolean;
  maxTokens: number;
  deprecated?: boolean;
}
