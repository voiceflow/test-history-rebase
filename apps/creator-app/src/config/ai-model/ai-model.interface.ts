import { AIGPTModel } from '@voiceflow/dtos';
import type { IconName } from '@voiceflow/icons';

export interface AIModelConfig {
  type: AIGPTModel;
  name: string;
  info: string;
  icon: IconName;
  hidden?: boolean;
  disabled?: boolean;
  deprecated?: boolean;
}
