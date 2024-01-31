import type { IconName } from '@voiceflow/icons';

export interface IAssistantNavigationItem {
  path: string;
  isActive: boolean;
  iconName: IconName;
  testID: string;
}
