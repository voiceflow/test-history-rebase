import type { Enum } from '@voiceflow/dtos';

export const IntegrationType = {
  ZENDESK: 'zendesk',
} as const;

export type IntegrationType = Enum<typeof IntegrationType>;
