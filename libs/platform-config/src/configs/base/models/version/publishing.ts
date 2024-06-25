import type { BaseVersion } from '@voiceflow/base-types';

export interface Model extends BaseVersion.Publishing {
  locales?: string[];
  invocationName: string;
  invocationNameSamples: string[];
  messagingServiceID?: string;
}
