import type { BaseResource } from '@/common';

import type { WorkspaceQuotaName } from './workspace-quota.enum';

export interface WorkspaceQuota extends BaseResource {
  name: WorkspaceQuotaName;
  quota: number;
  quotaID: number;
  enabled: boolean;
  consumed: number;
  lastReset: string;
  periodDays: number;
  resourceID: string;
  description?: string;
  defaultQuota: number;
  resourceScopeID: number;
}
