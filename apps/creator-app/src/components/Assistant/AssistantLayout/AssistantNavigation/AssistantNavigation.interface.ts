import type { IconName } from '@voiceflow/icons';

export interface IAssistantNavigationItem {
  path: string;
  testID: string;
  params?: Partial<Record<string, string>>;
  isActive: boolean;
  iconName: IconName;
}
