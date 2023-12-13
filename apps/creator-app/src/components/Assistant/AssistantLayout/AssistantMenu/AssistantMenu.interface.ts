import type { IconName } from '@voiceflow/icons';

export interface IAssistantMenuItem {
  path: string;
  isActive: boolean;
  iconName: IconName;
}
