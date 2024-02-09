import { BaseModels } from '@voiceflow/base-types';
import type { IconName } from '@voiceflow/icons';
import { BaseProps } from '@voiceflow/ui-next';

export interface IKBImportIntegrationPlatform extends BaseProps {
  onClose: VoidFunction;
  disabled?: boolean;
  onContinue: (data: { platform: BaseModels.Project.IntegrationTypes; subdomain?: string; authenticate: boolean }) => void;
}

export interface KBImportIntegrationPlatformItem {
  icon: IconName;
  label: string;
  value: BaseModels.Project.IntegrationTypes;
}
