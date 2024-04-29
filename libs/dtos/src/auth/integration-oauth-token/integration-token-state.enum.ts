import type { Enum } from '@/utils/type/enum.util';

export const IntegrationTokenState = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  INACTIVE: 'inactive',
} as const;

export type IntegrationTokenState = Enum<typeof IntegrationTokenState>;
