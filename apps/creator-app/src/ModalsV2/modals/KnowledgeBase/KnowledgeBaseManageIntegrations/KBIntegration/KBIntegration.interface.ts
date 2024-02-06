import { BaseModels } from '@voiceflow/base-types';
import type { IconName } from '@voiceflow/icons';

export interface IKBIntegration {
  creatorID: number;
  platform: string;
  date: string;
  icon: IconName;
  border?: boolean;
  type: BaseModels.Project.IntegrationTypes;
  onReconnect: () => void;
}
