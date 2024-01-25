import type { IconName } from '@voiceflow/icons';

export interface IKBIntegration {
  name: string;
  platform: string;
  date: string;
  icon: IconName;
  border?: boolean;
  onReconnect: () => void;
}
