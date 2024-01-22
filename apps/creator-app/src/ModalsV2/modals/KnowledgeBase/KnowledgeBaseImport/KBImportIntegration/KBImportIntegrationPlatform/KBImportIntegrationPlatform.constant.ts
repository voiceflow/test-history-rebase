import { KBImportIntegrationPlatformItem } from './KBImportIntegrationPlatform.interface';

export enum KBImportPlatformType {
  ZENDESK = 'zendesk',
}

export const ZENDESK_INTEGRATION_PLATFORM: KBImportIntegrationPlatformItem = {
  label: 'Zendesk help center',
  value: KBImportPlatformType.ZENDESK,
  icon: 'Zendesk',
};

export const INTEGRATION_PLATFORMS_MAPPER: Record<KBImportPlatformType, KBImportIntegrationPlatformItem> = {
  [KBImportPlatformType.ZENDESK]: ZENDESK_INTEGRATION_PLATFORM,
};

export const INTEGRATION_PLATFORMS = Object.values(INTEGRATION_PLATFORMS_MAPPER);
