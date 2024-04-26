import type { BaseModels } from '@voiceflow/base-types';
import type { IconName } from '@voiceflow/icons';

export interface IKBIntegration {
  type: BaseModels.Project.IntegrationTypes;
  date: string;
  icon: IconName;
  border?: boolean;
  platform: string;
  disabled?: boolean;
  onRemoved: VoidFunction;
  creatorID: number;
  onReconnect: VoidFunction;
  enableClose: VoidFunction;
  preventClose: VoidFunction;
}
