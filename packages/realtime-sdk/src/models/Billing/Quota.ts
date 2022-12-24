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
  description?: string;
  resourceLevel: ResourceLevel;
  enabled: boolean;
  defaultQuota: number;
}

export interface Quota {
  consumed: number;
  period: number;
  quota: number;
  lastReset: Date;
  quotaDetails: QuotaDetails;
}
