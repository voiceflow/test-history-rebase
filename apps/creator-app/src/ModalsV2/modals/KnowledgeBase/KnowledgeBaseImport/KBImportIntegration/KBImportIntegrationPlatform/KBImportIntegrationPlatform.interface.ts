import { BaseModels } from '@voiceflow/base-types';
import type { IconName } from '@voiceflow/icons';

export interface IKBImportIntegrationPlatform {
  onClose: VoidFunction;
  onContinue: VoidFunction;
  disabled?: boolean;
  setPlatform: (platform: BaseModels.Project.IntegrationTypes) => void;
  platform: BaseModels.Project.IntegrationTypes | null;
}

export interface KBImportIntegrationPlatformItem {
  label: string;
  value: BaseModels.Project.IntegrationTypes;
  icon: IconName;
}
