import { BaseModels } from '@voiceflow/base-types';

import { KBImportIntegrationPlatformItem } from './KBImportIntegrationPlatform.interface';

export const ZENDESK_INTEGRATION_PLATFORM: KBImportIntegrationPlatformItem = {
  label: 'Zendesk help center',
  value: BaseModels.Project.IntegrationTypes.ZENDESK,
  icon: 'Zendesk',
};

export const INTEGRATION_PLATFORMS_MAPPER: Record<BaseModels.Project.IntegrationTypes, KBImportIntegrationPlatformItem> = {
  [BaseModels.Project.IntegrationTypes.ZENDESK]: ZENDESK_INTEGRATION_PLATFORM,
};

export const INTEGRATION_PLATFORMS = Object.values(INTEGRATION_PLATFORMS_MAPPER);
