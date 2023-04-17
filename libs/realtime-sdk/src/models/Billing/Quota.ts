export enum ResourceLevel {
  Organization = 1,
  Workspace = 2,
  Assistant = 3,
}

export enum QuotaNames {
  TOKENS = 'OpenAI Tokens',
}

export interface QuotaDetails {
  id: string;
  name: string;
  enabled: boolean;
  description?: string;
  defaultQuota: number;
  resourceLevel: ResourceLevel;
}

export interface Quota {
  quota: number;
  period: number;
  consumed: number;
  lastReset: Date;
  quotaDetails: QuotaDetails;
}
