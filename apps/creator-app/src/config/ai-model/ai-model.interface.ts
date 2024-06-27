import type { AIModel, AIModelParam } from '@voiceflow/dtos';
import type { IconName } from '@voiceflow/icons';

export interface AIModelConfig extends AIModelParam {
  type: AIModel;
  name: string;
  info: string;
  icon: IconName;
  hidden?: boolean;
  /**
   * if the model requires upgrading to a higher plan
   */
  advanced?: boolean;
  disabled?: boolean;
}
