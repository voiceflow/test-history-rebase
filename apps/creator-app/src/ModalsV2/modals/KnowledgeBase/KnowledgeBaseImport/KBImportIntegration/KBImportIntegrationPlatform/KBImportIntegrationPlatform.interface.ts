import type { IconName } from '@voiceflow/icons';

import { KBImportPlatformType } from './KBImportIntegrationPlatform.constant';

export interface IKBImportIntegrationPlatform {
  onClose: VoidFunction;
  onContinue: VoidFunction;
  disabled?: boolean;
  setPlatform: (platform: KBImportPlatformType) => void;
  platform: KBImportPlatformType | null;
}

export interface KBImportIntegrationPlatformItem {
  label: string;
  value: KBImportPlatformType;
  icon: IconName;
}
